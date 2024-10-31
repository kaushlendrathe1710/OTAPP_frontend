import React from 'react'
import { Helmet } from 'react-helmet';
import styles from "../styles/services.module.scss";
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';

const linksArr = [
    {
        name: "Home",
        link: "https://www.mymegaminds.com/best-online-tutors-home/"
    },
    {
        name: "About",
        link: "https://www.mymegaminds.com/about"
    },
    {
        name: "Services",
        link: "https://www.mymegaminds.com/services/online-tutoring-services"
    },
    {
        name: "Services",
        link: "https://www.mymegaminds.com/services/online-homework-help"
    },
    {
        name: "Services",
        link: "https://www.mymegaminds.com/services/assignment-help"
    },
    {
        name: "Services",
        link: "https://www.mymegaminds.com/services/project-management-services-from-megamind"
    },
    {
        name: "Career",
        link: "https://www.mymegaminds.com/career"
    },
    {
        name: "Blog",
        link: "https://www.mymegaminds.com/blog"
    },
    {
        name: "Online Tutoring vs. In-Person Tutoring: Pros and Cons",
        link: "https://www.mymegaminds.com/blog/online-tutoring-vs-in-person-tutoring-pros-and-cons"
    },
    {
        name: "Why Online Homework Helpers Are Perfect for Busy Students",
        link: "https://www.mymegaminds.com/blog/why-online-homework-helpers-are-perfect-for-busy-students"
    },
    {
        name: "Why You Should Consider Professional Economics Homework Help",
        link: "https://www.mymegaminds.com/blog/why-you-should-consider-professional-economics-homework-help"
    },
    {
        name: "The Ethics of Using an Assignment Helper Online",
        link: "https://www.mymegaminds.com/blog/the-ethics-of-using-an-assignment-helper-online"
    },
    {
        name: "Boost Your Programming Skills with Math Help: A Guide to Success",
        link: "https://www.mymegaminds.com/blog/boost-your-programming-skills-with-math-help-a-guide-to-success"
    },
    {
        name: "Privacy Policy",
        link: "https://www.mymegaminds.com/privacy-policy"
    },
    {
        name: "Terms & Conditions",
        link: "https://www.mymegaminds.com/terms-conditions"
    },
    {
        name: "Refund/Cancellation Policy",
        link: "https://www.mymegaminds.com/refund-policy"
    },
]

const Sitemap = () => {
    return (
        <>
            <Helmet>
                <title>mymegaminds.com HTML Sitemap</title>
                <meta name="description" content="mymegaminds.com HTML Sitemap" />
            </Helmet>
            <Header />
            <section className={styles.pageWrapper}>
                <h1>Mymegaminds HTML Sitemap</h1>
                <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", marginLeft: "4rem", marginTop: "2rem" }}>
                    {
                        linksArr.map((item, index) => {
                            return <li key={index}><a href={item.link} style={{ color: "royalblue" }}>{item.name}</a></li>
                        })
                    }
                </ul>
            </section>
            <Footer />
        </>
    )
}

export default Sitemap