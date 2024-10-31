import React, { useContext, useEffect, useCallback } from "react";
import { IoClose, IoSpeedometer, IoPersonSharp } from "react-icons/io5";
import { RiCustomerService2Fill, RiMoneyDollarBoxFill } from "react-icons/ri";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import HighlightUnderlineText from "../components/text/HighlightUnderlineText";
import { QuickChatUserContext } from "../context/QuickChatUserContext";
import VerifyUser from "../components/quickChat/VerifyUser";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import chatBubblesJson from "../assets/lotties/quick-chat-bubble.json";
import studentIllus from "../assets/illus/student_with_marksheet.svg";
import styles from "../styles/landingPages.module.scss";
import chatStyles from "../styles/quickChat.module.scss";
import userContext from "../context/userContext";
import { Link } from "react-router-dom";

const BENEFITS = [
	{
		label: `Customized help tailored to your needs`,
		Icon: RiCustomerService2Fill,
	},
	{
		label: `Fast turnaround times`,
		Icon: IoSpeedometer,
	},
	{
		label: `Affordable pricing`,
		Icon: RiMoneyDollarBoxFill,
	},
	{
		label: `Experienced and qualified tutors`,
		Icon: IoPersonSharp,
	},
	{
		label: `24/7 support`,
		Icon: RiCustomerService2Fill,
	},
];
const SOCIAL_PROOFS = [
	{
		label: `95% satisfaction rate`,
	},
	{
		label: `5000+ happy students served`,
	},
	{
		label: `Trusted by leading universities`,
	},
];

let initialAnimation = { y: 80, opacity: 0 };
let whileInViewAnimation = { y: 0, opacity: 1 };
let transition = { type: "spring", duration: 0.75 };

const LandingPage_1 = () => {
	const { userData: loggedUser } = useContext(userContext);
	const {
		quickChatUser,
		setQuickChatUser,
		isAuthLoading,
		isQuickChatVisible,
		setIsQuickChatVisible,
	} = useContext(QuickChatUserContext);

	const { width } = useWindowDimensions();

	const handleSaveQuickChatUser = useCallback((user) => {
		setQuickChatUser(user);
	}, []);
	return (
		<>
			<Header />
			<div className={styles.landingPageWrapper}>
				{/* Hero section */}
				<section className={styles.heroSection}>
					<div className={styles.left}>
						<motion.div
							initial={initialAnimation}
							whileInView={whileInViewAnimation}
							viewport={{ once: true }}
							transition={transition}
							className={styles.headings}
						>
							<h1>
								Get Expert Help with Your <HighlightUnderlineText text={"Homework"} />,{" "}
								<HighlightUnderlineText text={"Assignments"} hueRotate={180} underlineWidth={98} />,
								and{" "}
								<HighlightUnderlineText text={"Projects"} hueRotate={225} underlineWidth={102} />
							</h1>
							<p>
								We offer affordable and reliable assistance for students in the USA, UK, Canada, and
								Australia.
							</p>
						</motion.div>
						<motion.div
							initial={initialAnimation}
							whileInView={whileInViewAnimation}
							viewport={{ once: true }}
							transition={transition}
							className={styles.form}
						>
							<h5>Tell us where you're studying and get started!</h5>
							{loggedUser ? (
								<i>
									Hey <b>{loggedUser?.name}</b>, your account already exists.{" "}
									<Link
										to={
											loggedUser?.userType?.toLowerCase().includes("admin")
												? `https://admin.mymegaminds.com/`
												: `/login/${loggedUser?.userType?.toLowerCase()}`
										}
										style={{ color: "var(--primary-500)" }}
									>
										Login here
									</Link>
								</i>
							) : quickChatUser === null ? (
								<VerifyUser
									studentLandingPageForm={true}
									userType={"Student"}
									getUser={handleSaveQuickChatUser}
									showLabeling={false}
									otpSendButtonText="Free Assistance"
									contentContainerStyle={{ padding: width < 425 ? "0" : "" }}
								/>
							) : (
								<button
									className={chatStyles.quickChatFixedButton}
									onClick={() => setIsQuickChatVisible(!isQuickChatVisible)}
									style={{ margin: "1rem 0" }}
								>
									{isQuickChatVisible ? (
										<IoClose size={24} color="var(--gray-50)" />
									) : (
										<Lottie
											animationData={chatBubblesJson}
											loop
											style={{ width: "44px", height: "44px" }}
										/>
									)}
									<span>{isQuickChatVisible ? "Close Chat" : "Ready to Chat?"}</span>
								</button>
							)}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									fontSize: "1rem",
								}}
							>
								Contact us via{" "}
								<a
									href="https://api.whatsapp.com/send/?phone=917481020076&text=&app_absent=0"
									target="_blank"
									rel="noopenner"
									style={{
										display: "flex",
										alignItems: "center",
										fontSize: "1rem",
										marginLeft: "0.5rem",
										gap: "0.25rem",
										fontWeight: 600,
										color: "#40c351",
									}}
								>
									<img
										src="https://img.icons8.com/color/44/null/whatsapp--v1.png"
										loading="eager"
										style={{
											width: 38,
											height: 38,
										}}
									/>
									<span>WhatsApp</span>
								</a>
							</div>
						</motion.div>
					</div>
					<motion.div
						initial={initialAnimation}
						whileInView={whileInViewAnimation}
						viewport={{ once: true }}
						transition={transition}
						className={styles.right}
					>
						<img src={studentIllus} alt="Student illustration" loading="eager" />
					</motion.div>
				</section>
				{/* Benefits section */}
				<section className={styles.benefitsSection}>
					{BENEFITS.map(({ label, Icon }, i) => {
						return <Benefit key={i} label={label} Icon={Icon} i={i} />;
					})}
				</section>
				{/* Social proof section */}
				<section className={styles.socialProofSection}>
					{SOCIAL_PROOFS.map(({ label }, i) => {
						return (
							<motion.div
								initial={initialAnimation}
								whileInView={whileInViewAnimation}
								viewport={{ once: true }}
								transition={{ ...transition, delay: `0.${i}` }}
								key={`${i + label}`}
								className={styles.socialProofWrapper}
							>
								<h4>{label}</h4>
							</motion.div>
						);
					})}
				</section>
			</div>
			<Footer />
		</>
	);
};

function Benefit({ Icon = () => {}, label = undefined, i = 0 }) {
	return (
		<motion.div
			initial={initialAnimation}
			whileInView={whileInViewAnimation}
			viewport={{ once: true }}
			transition={{ ...transition, delay: `0.${i}` }}
			className={styles.benefitWrapper}
		>
			<div>
				<Icon color={"white"} size={24} />
			</div>
			<h6>{label}</h6>
		</motion.div>
	);
}

export default LandingPage_1;
