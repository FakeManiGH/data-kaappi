import Header from "@/app/_components/Header";
import Footer from "../_components/Footer";


function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout;