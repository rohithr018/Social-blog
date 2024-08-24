import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
// import { HiUser } from "react-icons/hi";
// import { FaUserAlt } from "react-icons/fa";
import { CiUser, CiLogout } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';


export default function DashSidebar() {
    const location = useLocation()
    const [tab, setTab] = useState('')
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
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={CiUser}
                            label={"User"}
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
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
