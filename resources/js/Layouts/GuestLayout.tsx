import Footer from '@/Components/layoutComponents/Footer';
import GuestLayoutHeader from '@/Components/layoutComponents/Header';
import { Fragment, PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Fragment>
            <GuestLayoutHeader />
                {children}
            <Footer />
        </Fragment>
    );
}
