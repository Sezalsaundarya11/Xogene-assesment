

const Header = (props) =>{
    return (
        <>
        <header>
            <div className="header-container">
                <h1>Xogene Logo</h1>
                <p>{props.title}</p>
            </div>
        </header>
        </>
    )
}

export default Header;