import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    const { user, logout } = useAuth()

    const authenticatedNavigationItems = [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Dashboard", url: "/dashboard" },
        { id: 3, name: "Sessions", url: "/sessions" }
    ]

    const unauthenticatedNavigationItems = [
        { id: 1, name: "Home", url: "/" },
        { id: 2, name: "Login", url: "/login" }
    ]

    const navigationItems = user !== null ? authenticatedNavigationItems : unauthenticatedNavigationItems

    const handleClick = () => {
        logout()
    }

    return (
        <>
            <section className="navbar">
                <div className="title">
                    <h1>RiffLog</h1>
                </div>
                <div className="navbar-links">
                    <ul>
                        {navigationItems.map((item) => (
                            <li key={item.id}>
                                <Link to={item.url}>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {user !== null ? <div><p>{user.email}</p><button onClick={handleClick}>Logout</button></div> : <p>Not logged in</p>}
                </div>
            </section>
        </>
    )
}

export default Navbar