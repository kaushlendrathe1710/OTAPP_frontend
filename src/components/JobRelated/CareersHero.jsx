import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "../../styles/careers.module.scss";
import { CareerSlide } from "./CareerSlide";

export const CareersHero = () => {
  let reactBgImg = `https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`;

  let gameBgImg = `https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`;
  let dataScienceBgImg = `https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80`;
  let cyberSecurityBgImg = `https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;

  const carouselArr = [
    {
      id: 1,
      heading: "Apply for ReactJs developer",
      desc: `We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership, and responsibilty.`,
      redirectLink: ``,
      bgImg: reactBgImg,
    },
    {
      id: 2,
      heading: "Apply for Unity Game developer",
      desc: `We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership, and responsibilty.`,
      redirectLink: ``,
      bgImg: gameBgImg,
    },
    {
      id: 3,
      heading: "Apply for Data Science devloper",
      desc: `We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership, and responsibilty.`,
      redirectLink: ``,
      bgImg: dataScienceBgImg,
    },
    {
      id: 4,
      heading: "Apply for Cyber Security expert",
      desc: `We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership, and responsibilty.`,
      redirectLink: ``,
      bgImg: cyberSecurityBgImg,
    },
  ];

  return (
    <section className={`${styles.heroWrapper} careerSwiper`}>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        navigation={true}
        modules={[Navigation, Autoplay]}
        className="mySwiper"
        style={{ height: "100%" }}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
      >
        {carouselArr.map(({ id, heading, desc, redirectLink, bgImg }) => {
          return (
            <SwiperSlide key={id}>
              <CareerSlide
                heading={heading}
                desc={desc}
                redirectLink={redirectLink}
                bgImg={bgImg}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
