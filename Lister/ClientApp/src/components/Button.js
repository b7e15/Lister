import './Button.css'

export default function Button({ children, onClick, size, selected }) {
    const cssSize = Utils.selectCssSize(size)
    const cssSelected = Utils.selectCssSelected(selected)

    return (
        <>
            <button onClick={onClick} className={`button ${cssSize} ${cssSelected}`}>{children}</button>
        </>
    )
}


class Utils {
    static selectCssSize = (size) => {
        switch (size) {
            case 'small':
                return 'button_small'
            case 'large':
                return 'button_large'
            default:
                return ''
        }
    }

    static selectCssSelected = (selected) => {
        switch (selected) {
            case true:
                return 'button_selected'
            default:
                return ''
        }
    }
}