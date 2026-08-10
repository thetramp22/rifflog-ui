import { Link } from 'react-router'

function Navbar() {
    const navigationItems = [
        { id: 1, name: "Dashboard", url: "/dashboard" },
        { id: 2, name: "Sessions", url: "/sessions" },
        { id: 3, name: "Login", url: "/login" }
    ];

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
            </section>
        </>
    )
}

export default Navbar