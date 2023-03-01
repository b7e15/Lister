import './List.css'

export default function ListItem({ children }) {
    return (
        <li className='list__item'>
            {children}
        </li>
    )
}