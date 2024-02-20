import '../style/scss/components/LoadingSpinner.scss'

const LoadingSpinner = () => {
    return (
        <div className="LoadingSpinner">
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
