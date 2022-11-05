import { Flex, Container } from "@components/layout";
import "react-step-progress-bar/styles.css";
import { NextLink } from "@components/next-link";
import { useAuth } from "@context/auth";
import { MobileStepper } from "@components/mobile-stepper";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import { HiCog, HiHashtag, HiMenu } from "react-icons/hi";
import { AiFillCaretDown } from "react-icons/ai";
import { ROUTE_PATHS, IMAGE_PATHS } from "src/constants";
import { ActiveLink } from "./active-link";
import { LogoutModal } from "./logoutModal";
import { refreshJwt } from "@utils/refresh-jwt";
import { IdleTimerContainer } from "@components/idletimer";
import jwt from "jsonwebtoken";
import { SlideMenu } from "primereact/slidemenu";
import { ChangePasswordModal } from "./changePasswordModal";
import { MessageModal } from "./messageModal";
import { MobileMenuLinks } from "./mobile-menu";
import { useClickOutside } from "./use-click-outside";
import { useLogout } from "./use-logout";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { UserDropdownLinks } from "./user-dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
const commonLinks = [{ href: "/", text: "Home" }];

const anonymousDropdownLinks = [
  {
    href: ROUTE_PATHS.LOGIN,
    text: "Log in",
    icon: (
      <LoginIcon className="inline w-5 h-5 mr-2 text-gray-800 align-text-bottom" />
    ),
  },

  {
    href: ROUTE_PATHS.REGISTER,
    text: "Sign Up",
    icon: <HashTagIcon className="inline w-5 h-5 mr-2 align-text-bottom" />,
  },
];
const items = [
  {
    label: "Pillar Life",
    //  icon:'pi pi-fw pi-file',
    items: [
      {
        label: "Annuities",
        command: () => {
          window.location.href = "https://www.pillarlife.com/annuities/";
        },
      },
      {
        label: "Learn",
        //  icon:'pi pi-fw pi-trash'
      },
      {
        label: "MYGA Calculator",
        command: () => {
          window.location.href = "https://www.pillarlife.com/myga-calculator/";
        },
      },
      {
        label: "About",
        command: () => {
          window.location.href = "https://www.pillarlife.com/about/";
        },
      },
    ],
  },
  {
    label: "Annuities",
    //  icon:'pi pi-fw pi-pencil',
    items: [
      {
        label: "MYGA",
        command: () => {
          window.location.href = "https://www.pillarlife.com/annuities/myga/";
        },
      },
      {
        label: "SPIA",
        command: () => {
          window.location.href = "https://www.pillarlife.com/annuities/spia/";
        },
      },
    ],
  },
  {
    label: "Learn",
    //  icon:'pi pi-fw pi-user',
    items: [
      {
        label: "Annuities Explained",
        command: () => {
          window.location.href =
            "https://www.pillarlife.com/annuities-explained/";
        },
      },
      {
        label: "Reason to buy an Annuity",
        command: () => {
          window.location.href =
            "https://www.pillarlife.com/reasons-to-buy-an-annuity/";
        },
      },
      {
        label: "MYGA FAQs",
        command: () => {
          window.location.href = "https://www.pillarlife.com/myga-faqs/";
        },
      },
      {
        label: "Annuities Beneficiaries",
        command: () => {
          window.location.href =
            "https://www.pillarlife.com/annuity-beneficiaries/";
        },
      },
      {
        label: "Tips before Buying",
        command: () => {
          window.location.href =
            "https://www.pillarlife.com/tips-before-buying/";
        },
      },
    ],
  },
  {
    label: "MYGA Calculator",
    command: () => {
      window.location.href = "https://www.pillarlife.com/myga-calculator/";
    },
    //  icon:'pi pi-fw pi-power-off'
  },
  {
    label: " About",
    items: [
      {
        label: "Blog",
        command: () => {
          window.location.href = "https://www.pillarlife.com/blog/";
        },
      },
      {
        label: "Contact",
        command: () => {
          window.location.href = "https://www.pillarlife.com/contact/";
        },
      },
      {
        label: "Our Team",
        command: () => {
          window.location.href = "https://www.pillarlife.com/team/";
        },
      },
      {
        label: "What Makes pillar Different",
        command: () => {
          window.location.href =
            "https://www.pillarlife.com/what-makes-pillar-different/";
        },
      },
    ],
  },
];
export function Navbar() {
  const [policystatus, setStatus] = useState([]);
  const [isUser, setisUser] = useState(false);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleLeft2, setVisibleLeft2] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    const userinfo = jwt.decode(localStorage.getItem("cognito_id_token"));
    if (userinfo) {
      sessionStorage.setItem("userName", userinfo.sub);
      setisUser(true);
      var polciyArray = JSON.parse(localStorage.getItem("All_Policy_Status"));
      setStatus(polciyArray);
    }
  }, []);

  useEffect(() => {
    const userinfo = jwt.decode(localStorage.getItem("cognito_id_token"));
    if (userinfo) {
      sessionStorage.setItem("userName", userinfo.sub);
      setisUser(true);
      var polciyArray = JSON.parse(localStorage.getItem("All_Policy_Status"));
      setStatus(polciyArray);
    }
  }, [visibleLeft]);

  const routeUsers = (value) => {
    localStorage.removeItem("esignature_started");
    sessionStorage.removeItem("policyLocator");
    sessionStorage.removeItem("beneficiaryLocator");
    sessionStorage.removeItem("AL");
    sessionStorage.removeItem("sentId");

    if (value.find((item) => item.includes("Active"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 0 } },
        "/dashboard/my-policies"
      );
    }
    if (value.find((item) => item.includes("Cancelled"))) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 1 } },
        "/dashboard/my-policies"
      );
    }

    if (
      !value.find((item) => item.includes("Active")) &&
      !value.find((item) => item.includes("Cancelled"))
    ) {
      router.push(
        { pathname: "/dashboard/my-policies", query: { index: 0 } },
        "/dashboard/my-policies"
      );
    }

    setVisibleLeft(false);
  };
  const routeUsers1 = (value) => {
    localStorage.removeItem("esignature_started");
    sessionStorage.removeItem("policyLocator");
    sessionStorage.removeItem("beneficiaryLocator");
    sessionStorage.removeItem("AL");
    sessionStorage.removeItem("sentId");

    if (value.find((item) => item.includes("In Review"))) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 0 } },
        "/dashboard/my-applications"
      );
    }
    if (value.find((item) => item.includes("Draft"))) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 1 } },
        "/dashboard/my-applications"
      );
    }
    if (
      !value.find((item) => item.includes("In Review")) &&
      !value.find((item) => item.includes("Draft"))
    ) {
      router.push(
        { pathname: "/dashboard/my-applications", query: { index: 0 } },
        "/dashboard/my-applications"
      );
    }

    setVisibleLeft(false);
  };

  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });
  const {
    state: { isAuthenticated, user, userConfig },
    initializeUser,
  } = useAuth();
  const handleLogout = useLogout();
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);
  const app = router.pathname.includes("/application");
  const policy = router.pathname.includes("/my-policies");
  const myapp = router.pathname.includes("/my-applications");
  const setBar =
    router.pathname.includes("/application") ||
    router.pathname.includes("/my-policies") ||
    router.pathname.includes("/my-applications") ||
    router.pathname.includes("/dashboard");
  const [showsUserDropdown, setShowsUserDropdown] = useState(false);
  const [showsPillarDropdown, setShowsPillarDropdown] = useState(false);
  const [showsAnnutiesDropdown, setShowsAnnutiesDropdown] = useState(false);
  const [showsLearnDropdown, setShowsLearnDropdown] = useState(false);

  const [showsMobileMenu, setShowsMobileMenu] = useState(false);
  const [show, setshowModal] = useState(false);
  const [showPwd, setshowPwdModal] = useState(false);
  const [visible, setVisiblity] = useState(false);
  const [visible1, setVisiblity1] = useState(false);
  const [visible2, setVisiblity2] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const visibility = useCallback((val) => setVisiblity(!val), []);
  const visibility1 = useCallback((val) => setVisiblity1(!val), []);
  const visibility2 = useCallback((val) => setVisiblity2(!val), []);
  const message = useCallback((val) => setSuccessMsg(val), []);
  const closeModal = useCallback(() => setshowModal(), []);
  const closePasswordModal = useCallback(() => passwordModal(), []);
  const closeMobileMenu = () => setShowsMobileMenu(false);
  const closeUserDropdown = () => setShowsUserDropdown(false);
  const closePillarDropdown = () => setShowsPillarDropdown(false);
  const closeAnnutiesDropdown = () => setShowsAnnutiesDropdown(false);
  const closeLearnDropdown = () => setShowsLearnDropdown(false);

  const closeMenus = () => {
    closeMobileMenu();
    closeUserDropdown();
    closePillarDropdown();
    closeAnnutiesDropdown();
    closeLearnDropdown();
  };
  const navbarRef = useRef(null);
  const passwordModal = () => {
    setshowPwdModal(false);
    setVisiblity(false);
    setVisiblity1(false);
    setVisiblity2(false);
  };
  const handleButton = (e) => {
    setShowsUserDropdown(false);
    setshowModal(true);
  };
  const handleManage = (e) => {
    setShowsUserDropdown(false);
    router.push("/mydata/manage");
  };
  const handlePassword = (e) => {
    setShowsUserDropdown(false);
    setshowPwdModal(true);
  };

  let closesidebar = useCallback(() => {
    setVisibleLeft(false);
  }, []);

  const authenticatedDropdownLinks = [
    user && {
      href: "",
      text: user.email,
    },
  ];
  const pillarLife = [
    {
      href: "https://www.pillarlife.com/annuities/",
      text: "Annuities",
    },
    {
      href: "",
      text: "Learn",
    },
    {
      href: "https://www.pillarlife.com/myga-calculator/",
      text: "MYGA Calculator",
    },
    {
      href: "https://www.pillarlife.com/about/",
      text: "About",
    },
  ];
  const learn = [
    {
      href: "https://www.pillarlife.com/annuities-explained/",
      text: "Annuities Explained",
    },
    {
      href: "https://www.pillarlife.com/reasons-to-buy-an-annuity/",
      text: "Reasons to Buy An Annuity",
    },
    {
      href: "https://www.pillarlife.com/myga-faqs/",
      text: "MYGA FAQs",
    },
    {
      href: "https://www.pillarlife.com/annuity-beneficiaries/",
      text: "Annuity Beneficiaries",
    },
    {
      href: "https://www.pillarlife.com/tips-before-buying/",
      text: "Tips Before Buying",
    },
  ];

  const Annuities = [
    {
      href: "https://www.pillarlife.com/annuities/myga/",
      text: "MYGA",
    },
    {
      href: "https://www.pillarlife.com/annuities/spia/",
      text: "SPIA",
    },
  ];
  const about = [
    {
      href: "https://www.pillarlife.com/blog/ ",
      text: "Blog ",
    },
    {
      href: "https://www.pillarlife.com/contact/",
      text: "Contact",
    },
    {
      href: "https://www.pillarlife.com/team/ ",
      text: "Our Team",
    },
    {
      href: "https://www.pillarlife.com/what-makes-pillar-different/",
      text: "What Makes Pillar Different?",
    },
  ];

  useClickOutside(navbarRef, closeMenus);
  const toggleUserDropdown = () => {
    setShowsUserDropdown((prev) => !prev);
    setShowsAnnutiesDropdown(false);
    setShowsLearnDropdown(false);
    setShowsPillarDropdown(false);
    closeMobileMenu();
  };
  useClickOutside(navbarRef, closeMenus);
  const togglePillarDropdown = () => {
    setShowsPillarDropdown((prev) => !prev);
    setShowsUserDropdown(false);
    setShowsAnnutiesDropdown(false);
    setShowsLearnDropdown(false);
    closeMobileMenu();
  };
  const toggleAnnutiesDropdown = () => {
    setShowsAnnutiesDropdown((prev) => !prev);
    setShowsUserDropdown(false);
    setShowsLearnDropdown(false);
    setShowsPillarDropdown(false);
    closeMobileMenu();
  };
  const toggleLearnDropdown = () => {
    setShowsLearnDropdown((prev) => !prev);
    setShowsAnnutiesDropdown(false);
    setShowsUserDropdown(false);
    setShowsPillarDropdown(false);
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setShowsMobileMenu((prev) => !prev);
    closeUserDropdown();
  };
  const handleClick = () => {
    sessionStorage.removeItem("policyLocator");
    sessionStorage.removeItem("beneficiaryLocator");
    sessionStorage.removeItem("AL");
    localStorage.removeItem("esignature_started");
    router.push(ROUTE_PATHS.FUNDS);
    setVisibleLeft(false);
  };
  const links = [...commonLinks];
  if (isAuthenticated) {
    if (user?.isAdmin) {
      links.push({ href: ROUTE_PATHS.CONTACTS, text: "Contacts" });
    }
  }
  const userName = user && user.email.split("@")[0];
  const dropdownLinks = isAuthenticated
    ? authenticatedDropdownLinks
    : anonymousDropdownLinks;

  const logout = async () => {
    await handleLogout();
  };

  const refresh = async () => {
    await refreshJwt();
  };

  return (
    <>
      <div className="bg-white" style={{ minHeight: "65px" }}>
        <nav ref={navbarRef} className="bg-purple">
          <div className="max-w-7xl ml-0 mr-2 ml-1 pl-5">
            <Flex className="relative justify-between h-16">
              <Flex className="absolute inset-y-0 left-0 items-center sm:hidden"></Flex>
              {/* <SlideMenu ref={menu} model={items} popup /> */}
              <SlideMenu
                ref={menu}
                model={items}
                popup
                viewportHeight={320}
                baseZIndex={99999999}
                menuWidth={200}
              ></SlideMenu>
              <Sidebar
                className="sider"
                visible={visibleLeft2}
                onHide={() => setVisibleLeft2(false)}
                dismissable
              >
                <SlideMenu model={items} />
              </Sidebar>
              <Sidebar
                className="sider"
                visible={visibleLeft}
                onHide={() => setVisibleLeft(false)}
                dismissable
              >
                {app ? (
                  <Flex className="flex flex-col">
                    <Flex
                      onClick={handleClick}
                      className={app ? "new-app " : ""}
                    >
                      <img src={IMAGE_PATHS.NEWAPP} />
                      <h5 className="p-3 sidebar-menu">New Application</h5>
                    </Flex>
                    <Container className=" mt-7 mb-5">
                      <MobileStepper close={closesidebar} />
                    </Container>
                  </Flex>
                ) : (
                  <Button
                    onClick={handleClick}
                    className="btncolor w-full borderRadius"
                  >
                    <div>
                      <h3 className="text-sm font-semibold">New Application</h3>
                      <h6 className="text-xs text-left">apply now</h6>
                    </div>
                    <img className="ml-4" src={IMAGE_PATHS.ARROW} />
                  </Button>
                )}
                <Divider />

                <Flex
                  onClick={() => {
                    routeUsers(policystatus);
                  }}
                  className={policy ? "new-app" : ""}
                >
                  <img src={IMAGE_PATHS.POLICY} />
                  <h5 className="p-3 sidebar-menu">My Policies</h5>
                </Flex>

                <Flex
                  onClick={() => {
                    routeUsers1(policystatus);
                  }}
                  className={myapp ? "new-app" : ""}
                >
                  <img src={IMAGE_PATHS.MYAPP} />
                  <h5 className="p-3 sidebar-menu">My Applications</h5>
                </Flex>
                {/* </NextLink> */}
              </Sidebar>
              <Flex className="absolute items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                {isTabletOrMobile && setBar && (
                  <Button
                    icon="pi pi-bars"
                    onClick={() => setVisibleLeft(true)}
                    className="mobilebars mr-2"
                  />
                )}
                {isTabletOrMobile && !setBar && (
                  <Button
                    icon="pi pi-bars"
                    onClick={(event) => menu.current.toggle(event)}
                    className="mobilebars mr-2"
                  />
                )}
                <Flex className="items-center flex-shrink-0">
                  <NextLink
                    href={isAuthenticated ? "/" : "http://pillarlife.com/"}
                    className=" relative text-gray-900 title-font md:mb-0"
                    aria-label="home"
                  >
                    <BrandIcon />
                  </NextLink>
                </Flex>
              </Flex>

              <Flex className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></Flex>
              <Flex className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!isAuthenticated && !isTabletOrMobile && !setBar && (
                  // <Menubar model={items}/>
                  <div className="relative ml-6">
                    <div>
                      <h2
                        className="usertitle"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                        onClick={togglePillarDropdown}
                      >
                        {"Pillar Life"}
                        <AiFillCaretDown
                          className="marginleft"
                          style={{ display: "inline" }}
                        />
                      </h2>
                    </div>
                    <UserDropdownLinks
                      className={`${
                        !showsPillarDropdown ? "hidden" : ""
                      } absolute right-0 w-52 sm:w-52 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                      {pillarLife.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <a
                            onClick={closePillarDropdown}
                            role="menuitem"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 break-words"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {link.icon}
                            {link.text}
                          </a>
                        </Link>
                      ))}
                    </UserDropdownLinks>
                  </div>
                )}
                {!isAuthenticated && !isTabletOrMobile && !setBar && (
                  // <Menubar model={items}/>
                  <div className="relative ml-6">
                    <div>
                      <h2
                        className="usertitle"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                        onClick={toggleAnnutiesDropdown}
                      >
                        {"Annuities "}
                        <AiFillCaretDown
                          className="marginleft"
                          style={{ display: "inline" }}
                        />
                      </h2>
                    </div>
                    <UserDropdownLinks
                      className={`${
                        !showsAnnutiesDropdown ? "hidden" : ""
                      } absolute right-0 w-52 sm:w-52 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                      {Annuities.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <a
                            onClick={closeAnnutiesDropdown}
                            role="menuitem"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 break-words"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {link.icon}
                            {link.text}
                          </a>
                        </Link>
                      ))}
                    </UserDropdownLinks>
                  </div>
                )}
                {!isAuthenticated && !isTabletOrMobile && !setBar && (
                  // <Menubar model={items}/>
                  <div className="relative ml-6">
                    <div>
                      <h2
                        className="usertitle"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                        onClick={toggleLearnDropdown}
                      >
                        {"Learn"}
                        <AiFillCaretDown
                          className="marginleft"
                          style={{ display: "inline" }}
                        />
                      </h2>
                    </div>
                    <UserDropdownLinks
                      className={`${
                        !showsLearnDropdown ? "hidden" : ""
                      } absolute right-0 w-52 sm:w-52 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                      {learn.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <a
                            onClick={closeLearnDropdown}
                            role="menuitem"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 break-words"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {link.icon}
                            {link.text}
                          </a>
                        </Link>
                      ))}
                    </UserDropdownLinks>
                  </div>
                )}
                {!isAuthenticated && !isTabletOrMobile && !setBar && (
                  // <Menubar model={items}/>
                  <div className="relative ml-6">
                    <div>
                      <h2
                        className="usertitle"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                        onClick={() =>
                          router.push(
                            "https://www.pillarlife.com/myga-calculator/"
                          )
                        }
                      >
                        {"MYGA Calculator"}
                      </h2>
                    </div>
                  </div>
                )}
                {!isAuthenticated && !isTabletOrMobile && !setBar && (
                  // <Menubar model={items}/>
                  <div className="relative ml-6">
                    <div>
                      <h2
                        className="usertitle"
                        style={{ color: "#ffffff", fontWeight: 600 }}
                        onClick={toggleUserDropdown}
                      >
                        {"About"}
                        <AiFillCaretDown
                          className="marginleft"
                          style={{ display: "inline" }}
                        />
                      </h2>
                    </div>
                    <UserDropdownLinks
                      className={`${
                        !showsUserDropdown ? "hidden" : ""
                      } absolute right-0 w-52 sm:w-52 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
                    >
                      {about.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <a
                            onClick={closeUserDropdown}
                            role="menuitem"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 break-words"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {link.icon}
                            {link.text}
                          </a>
                        </Link>
                      ))}
                    </UserDropdownLinks>
                  </div>
                )}
                {!isAuthenticated && router.pathname === "/" && (
                  <div className=" hidden sm:block">
                    <img
                      className=" relative ml-6 w-5 h-4 mb-3"
                      src={IMAGE_PATHS.CHAT}
                      alt="grp"
                    />
                  </div>
                )}
                {!isAuthenticated && router.pathname === "/" && (
                  <>
                    <p className="hidden sm:block relative text-white font-medium ml-4 text-xs">
                      Question?<br></br>
                      <span className="font-semibold text-sm">847 283 284</span>
                    </p>
                  </>
                )}
                <div className="relative ml-3">
                  {!isAuthenticated ? (
                    router.pathname === "/" ? (
                      <div>
                        <Link key={ROUTE_PATHS.LOGIN} href={ROUTE_PATHS.LOGIN}>
                          <Button
                            type="submit"
                            className="login-btn flex justify-center"
                          >
                            LOGIN
                          </Button>
                        </Link>
                      </div>
                    ) : null
                  ) : (
                    <div className="relative ml-3">
                      <div>
                        <h2
                          className="usertitle"
                          style={{ color: "#ffffff", fontWeight: 600 }}
                          onClick={toggleUserDropdown}
                        >
                          {userName}
                          <AiFillCaretDown
                            className="marginleft"
                            style={{ display: "inline" }}
                          />
                        </h2>
                      </div>
                      <UserDropdownLinks
                        className={`${
                          !showsUserDropdown ? "hidden" : ""
                        } absolute right-0 w-52 sm:w-52 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
                      >
                        {dropdownLinks.map((link) => (
                          <Link key={link.href} href={link.href}>
                            <a
                              onClick={closeUserDropdown}
                              role="menuitem"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 break-words"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {link.icon}
                              {link.text}
                            </a>
                          </Link>
                        ))}

                        {isAuthenticated && (
                          <ChangePassword
                            onClick={(e) => {
                              handlePassword(e);
                            }}
                          >
                            <ChangePwd className="inline w-4 h-4 mr-2 align-text-bottom" />
                            Change Password
                          </ChangePassword>
                        )}
                        {isAuthenticated && (
                          <ManageButton
                            onClick={(e) => {
                              handleManage(e);
                            }}
                          >
                            <CogIcon className="inline w-4 h-4 mr-2 align-text-bottom" />{" "}
                            Manage Data
                          </ManageButton>
                        )}
                        {isAuthenticated && (
                          <LogoutButton
                            onClick={(e) => {
                              handleButton(e);
                            }}
                          >
                            <LogoutIcon className="inline w-4 h-4 mr-2 align-text-bottom" />{" "}
                            Log Out
                          </LogoutButton>
                        )}
                      </UserDropdownLinks>
                    </div>
                  )}
                  {show && (
                    <LogoutModal showsModal={true} closeModal={closeModal} />
                  )}
                  {showPwd && (
                    <ChangePasswordModal
                      visible={visible}
                      visibility={visibility}
                      visibility1={visibility1}
                      visible1={visible1}
                      message={message}
                      visibility2={visibility2}
                      visible2={visible2}
                      userConfig={userConfig}
                      showsPasswordModal={true}
                      closePasswordModal={closePasswordModal}
                    />
                  )}
                  {successMsg && (
                    <MessageModal message={message} showsModal={true} />
                  )}
                </div>
              </Flex>
            </Flex>
          </div>

          <MobileMenuLinks
            className={`${showsMobileMenu ? "block" : "hidden"} sm:hidden`}
          >
            <div className="pt-2 pb-4 space-y-1">
              {links.map((link) => (
                <ActiveLink
                  key={link.href}
                  href={link.href}
                  activeClassName="bg-indigo-50 border-indigo-500 text-indigo-700"
                  inactiveClassName="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  <a
                    onClick={closeMobileMenu}
                    role="link"
                    className="block py-2 pl-3 pr-4 text-base font-medium border-l-4"
                  >
                    {link.text}
                  </a>
                </ActiveLink>
              ))}
            </div>
          </MobileMenuLinks>
        </nav>
      </div>
      {isAuthenticated && (
        <IdleTimerContainer
          logout={logout}
          refresh={refresh}
          isAuthenticated={isAuthenticated}
        />
      )}
    </>
  );
}
function LogoutButton({ onClick, children }) {
  return (
    <Link href="#">
      <a
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        style={{ fontSize: "0.75rem" }}
      >
        {children}
      </a>
    </Link>
  );
}
function ChangePassword({ onClick, children }) {
  return (
    <Link href="#">
      <a
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        style={{ fontSize: "0.75rem" }}
      >
        {children}
      </a>
    </Link>
  );
}
function ManageButton({ onClick, children }) {
  return (
    <Link href="#">
      <a
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
        style={{ fontSize: "0.75rem" }}
      >
        {children}
      </a>
    </Link>
  );
}
function BurgerIcon({ className = "w-6 h-6" }) {
  return <HiMenu className={className} />;
}
function BrandIcon() {
  return (
    <img src={IMAGE_PATHS.LOGO} style={{ height: "64px" }} alt="no_logo" />
  );
}
function CogIcon({ className }) {
  return <HiCog className={className} />;
}
function LogoutIcon({ className }) {
  return <GoSignOut className={className} />;
}
function ChangePwd({ className }) {
  return <FaPencilAlt className={className} />;
}
function LoginIcon({ className }) {
  return <GoSignIn className={className} />;
}
function HashTagIcon({ className }) {
  return <HiHashtag className={className} />;
}
