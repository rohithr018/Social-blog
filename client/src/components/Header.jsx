import React from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { LuMoon, LuSun } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice'
// import WbSunnyRoundedIcon from '@mui/icons-material'
export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user)
    const { theme } = useSelector(state => state.theme)

    return (
        <Navbar className='sticky top-0 z-50 border-b-2 dark:border-gray-700'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Blog
                </span>
                Blog
            </Link>
            <form className='hidden lg:block'>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='dark:bg-gray-700 dark:border-gray-400'
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch className='text-gray-500 dark:text-gray-400' />
            </Button>
            <div className='flex gap-5 items-center md:order-2'>

                <Button
                    className='w-12 h-10 p-0 flex items-center justify-center sm:inline  text-2xl'
                    color='gray'
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? (
                        <LuSun /> // Adjust size as needed
                    ) : (
                        <LuMoon /> // Adjust size as needed
                    )}
                    {/* <FaMoon className='text-gray-500 dark:text-gray-400' />
                    <FaSun className='text-gray-500 dark:text-gray-400' /> */}
                </Button>
                {currentUser ?
                    (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item>Sign out</Dropdown.Item>
                            {/* <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </Dropdown.Header> */}

                        </Dropdown>
                    ) :
                    (
                        <Link to='/sign-in'>
                            <Button
                                gradientDuoTone='purpleToBlue'
                                outline
                                className='shadow-md hover:shadow-lg hover:bg-gradient-to-r from-purple-500 to-blue-500 hover:text-white transition-all duration-300 dark:border-gray-600 dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-purple-700 dark:hover:to-blue-700'
                            >
                                Sign In
                            </Button>
                        </Link>
                    )
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link as={Link} to="/" active={path === "/"} className='dark:text-white'>
                    Home
                </Navbar.Link>
                <Navbar.Link as={Link} to="/about" active={path === "/about"} className='dark:text-white'>
                    About
                </Navbar.Link>
                <Navbar.Link as={Link} to="/projects" active={path === "/projects"} className='dark:text-white'>
                    Projects
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
