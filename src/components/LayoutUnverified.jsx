import React from 'react'
import NavbarUnverified from './NavbarUnverified'

const LayoutUnverified = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-full'>
                <div className='grow'>
                    <NavbarUnverified />
                    <div className='m-5'>{children}</div>
                </div>
            </div>
        </>
    )
}

export default LayoutUnverified
