import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Guest from '@/Layouts/GuestLayout';


export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />
            <Guest>
                Hello
            </Guest>
        </>
    );
}
