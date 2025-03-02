import Header from "@/app/_components/Header";


function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default Layout;