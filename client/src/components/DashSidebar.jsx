import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
// import { HiUser } from "react-icons/hi";
// import { FaUserAlt } from "react-icons/fa";
import { CiUser, CiLogout } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

export default function DashSidebar() {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const currentUser = useSelector(state => state.user.currentUser)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        setTab(urlParams.get('tab'))

    }, [location.search]);
    const dispatch = useDispatch();
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })

            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signoutSuccess())
            }

        } catch (err) {
            console.log(err)
        }

    }
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={CiUser}
                            label={currentUser.isAdmin ? "Admin" : "User"}
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        currentUser.isAdmin &&
                        <>
                            <Link to='/dashboard?tab=posts'>
                                <Sidebar.Item
                                    active={tab === 'posts'}
                                    icon={IoDocumentTextOutline}
                                    as='div'
                                >
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=users'>
                                <Sidebar.Item
                                    active={tab === 'users'}
                                    icon={FaUsers}
                                    as='div'
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                        </>
                    }
                    <Sidebar.Item
                        className='cursor-pointer'
                        icon={CiLogout}
                        onClick={handleSignout}
                    >
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>

    )
}
