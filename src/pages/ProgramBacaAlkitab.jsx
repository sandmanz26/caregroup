import { useEffect, useRef, useState } from 'react'
import { Volume2, Heart, MessageCircle, Share2, CheckCircle2, Flame, ChevronRight, Image as ImageIcon, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui'
import BottomSheet from '../components/BottomSheet'
import { TierStatusCard, TierLadderCard } from '../components/TierProgress'
import { readingTiers } from '../data/mockData'
import { formatLongDate } from '../utils/date'
import { computeReadingStats } from '../utils/reading'

const SCROLL_END_THRESHOLD = 24

function isScrolledToEnd(el) {
  return !!el && el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_END_THRESHOLD
}

function RenunganListRow({ item, onOpen }) {
  const { user, bibleReadingCheckins } = useApp()
  const done = bibleReadingCheckins.some((c) => c.userId === user.id && c.date === item.date)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-lg border border-ink-200 bg-white p-4 text-left hover:bg-ink-50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <ImageIcon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-900">{item.title}</p>
        <p className="text-xs text-brand-600">{item.verse}</p>
        <p className="mt-0.5 flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1"><Heart size={12} /> {item.likes}</span>
          <span className="flex items-center gap-1"><MessageCircle size={12} /> {item.comments.length}</span>
        </p>
      </div>
      {done && <Badge color="good">Selesai</Badge>}
      <ChevronRight size={18} className="shrink-0 text-ink-400" />
    </button>
  )
}

function RenunganDetailContent({ item, isToday, reachedEnd }) {
  const { user, toggleRenunganLike, addRenunganComment, renunganLikedIds, markSaatTeduhDone, bibleReadingCheckins } = useApp()
  const [playing, setPlaying] = useState(false)
  const [commentText, setCommentText] = useState('')

  const liked = (renunganLikedIds[user.id] || []).includes(item.id)
  const doneToday = bibleReadingCheckins.some((c) => c.userId === user.id && c.date === item.date)
  const alreadyCommented = item.comments.some((c) => c.userId === user.id)

  function handleComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    addRenunganComment(item.id, commentText)
    setCommentText('')
  }

  function handleShare() {
    const url = `${window.location.origin}/baca-alkitab`
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <>
      <p className="mb-3 text-xs text-ink-400">{formatLongDate(item.date)}</p>

      <div className="mb-3 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg bg-ink-200 text-ink-500">
        <ImageIcon size={28} />
        <span className="text-xs">{item.image?.caption || 'Ilustrasi renungan'}</span>
      </div>

      <p className="text-xs text-brand-600">{item.verse}</p>

      <button
        onClick={() => setPlaying((v) => !v)}
        className="mt-3 flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100"
      >
        <Volume2 size={14} />
        {playing ? 'Memutar renungan…' : item.audioLabel}
      </button>

      <div className="mt-3 flex flex-col gap-3 text-sm text-ink-600">
        {item.text.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-3 rounded-md bg-ink-100 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Penuntun Doa</p>
        <p className="mt-1 text-sm text-ink-600">{item.prayerGuide}</p>
      </div>

      <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-3">
        <button
          onClick={() => toggleRenunganLike(item.id)}
          className={`flex items-center gap-1.5 text-sm font-medium ${liked ? 'text-brand-600' : 'text-ink-500'}`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {item.likes}
        </button>
        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-500">
          <MessageCircle size={16} /> {item.comments.length}
        </span>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm font-medium text-ink-500">
          <Share2 size={16} /> Bagikan
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
        {item.comments.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="font-medium text-ink-900">{c.memberName}</span>{' '}
            <span className="text-ink-600">{c.text}</span>
          </div>
        ))}
        {alreadyCommented ? (
          <p className="text-xs text-ink-400">Kamu sudah memberi komentar di renungan ini.</p>
        ) : (
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar… (1x per orang)"
              className="flex-1 rounded-md border border-ink-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400"
            />
            <button type="submit" className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600">
              Kirim
            </button>
          </form>
        )}
      </div>

      {isToday && (
        <button
          onClick={markSaatTeduhDone}
          disabled={doneToday || !reachedEnd}
          className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-3 text-sm font-medium ${
            doneToday
              ? 'cursor-default bg-good-100 text-good-500'
              : reachedEnd
              ? 'bg-brand-500 text-white hover:bg-brand-600'
              : 'cursor-not-allowed bg-ink-100 text-ink-400'
          }`}
        >
          {doneToday || reachedEnd ? <CheckCircle2 size={16} /> : <Lock size={14} />}
          {doneToday
            ? 'Sudah selesai saat teduh hari ini'
            : reachedEnd
            ? 'Tandai Selesai Saat Teduh'
            : 'Baca sampai selesai untuk menandai'}
        </button>
      )}
    </>
  )
}

export default function ProgramBacaAlkitab() {
  const { user, renunganList, bibleReadingCheckins } = useApp()
  const stats = computeReadingStats(bibleReadingCheckins, user.id)
  const [todayItem, ...pastItems] = renunganList
  const [selectedId, setSelectedId] = useState(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const contentRef = useRef(null)
  const selected = renunganList.find((r) => r.id === selectedId) || null

  useEffect(() => {
    setReachedEnd(false)
    if (!selectedId) return
    // Short content that doesn't need scrolling still counts as "read".
    const raf = requestAnimationFrame(() => {
      if (isScrolledToEnd(contentRef.current)) setReachedEnd(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [selectedId])

  function handleScroll(e) {
    if (isScrolledToEnd(e.currentTarget)) setReachedEnd(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Daily Shema</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Program Baca Alkitab Harian</h1>
      </div>

      <TierStatusCard
        icon={Flame}
        total={stats.totalAllTime}
        unitLabel="hari dibaca"
        caption="Total saat teduh yang sudah kamu tandai selesai"
        stats={stats}
        tierUnit=" hari"
      />

      <TierLadderCard title="Tangga Penghargaan" tiers={readingTiers} stats={stats} unit=" hari" />

      {todayItem && (
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Renungan Hari Ini</p>
          <RenunganListRow item={todayItem} onOpen={() => setSelectedId(todayItem.id)} />
        </div>
      )}

      {pastItems.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Renungan Sebelumnya</p>
          <div className="flex flex-col gap-2">
            {pastItems.map((item) => (
              <RenunganListRow key={item.id} item={item} onOpen={() => setSelectedId(item.id)} />
            ))}
          </div>
        </div>
      )}

      <BottomSheet
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.title}
        onScroll={handleScroll}
        contentRef={contentRef}
      >
        {selected && (
          <RenunganDetailContent item={selected} isToday={selected.id === todayItem?.id} reachedEnd={reachedEnd} />
        )}
      </BottomSheet>
    </div>
  )
}
