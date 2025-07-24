import React from 'react'
import TopHeader from './TopHeader'
import HeaderBottom from './HeaderBottom'
import HeaderMenu from './HeaderMenu'

export default function GuestLayoutHeader() {
    return (
        <header className="gi-header bg-[#fff] z-[14] max-[991px]:z-[16] relative">
            {/* Header Top Start */}
            <TopHeader />
            {/* Header Top  End */}
            {/* Header Bottom  Start */}
            <HeaderBottom />
            {/* Header Button End */}
            {/* Header menu */}
            <HeaderMenu />
            {/* Header menu End */}
        </header>

    )
}
