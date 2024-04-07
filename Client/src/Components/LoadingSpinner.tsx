import '../style/scss/components/LoadingSpinner.scss'

type LoadingSpinnerProps = {
  maxHeight?: string
  maxWidth?: string
}

const LoadingSpinner = ({ maxHeight, maxWidth }: LoadingSpinnerProps) => {
  return (
    <div
      className="LoadingSpinner"
      style={{
        maxHeight: maxHeight || '100vh - 17rem',
        maxWidth: maxWidth || '100%',
      }}
    >
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
