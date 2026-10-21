// Bingkai ponsel untuk layar lebar: aplikasi selalu tampil dengan lebar ponsel (target React Native).
// Di ponsel sungguhan (< 768px) bingkai, status bar palsu, dan home indicator disembunyikan lewat CSS.
// `transform` pada .device membuat elemen `fixed` (tab bar, bottom sheet) menempel ke layar ponsel, bukan jendela.
export default function DeviceFrame({ children }) {
  return (
    <div className="device-stage">
      <div className="device">
        <div className="device-status" aria-hidden>
          <span className="device-time">9:41</span>
          <span className="device-island" />
          <span className="device-icons">
            <svg width="17" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
            <span className="device-batt"><i /></span>
          </span>
        </div>
        <div className="device-scroll" id="app-scroll">{children}</div>
        <div className="device-home" aria-hidden />
      </div>
    </div>
  )
}
