import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Guest from '@/Layouts/GuestLayout';
import DayDeals from '@/Components/App/Home/DayDeals';
import TopSellingProducts from '@/Components/App/Home/Top-SellingProducts';


export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />
            <Guest>
                <DayDeals />
                <TopSellingProducts />
            </Guest>
        </>
    );
}
