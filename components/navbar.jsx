"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

export default function Navbar() {

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		redirect("/login");
	}

	return (

		<Disclosure as="nav" className="bg-gray-800">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								<a
									href="/dashboard"
									className='bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
								>
									Dashboard
								</a>
								<a
									href="/slideshow"
									target="_blank"
									className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
								>
									Slideshow
								</a>
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<button
							onClick={handleSignOut}
							className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					<DisclosureButton
						as="a"
						href="/dashboard"
						className='bg-gray-900 text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'
					>
						Dashboard
					</DisclosureButton>
					<DisclosureButton
						as="a"
						href="/slideshow"
						target="_blank"
						className='text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'
					>
						Slideshow
					</DisclosureButton>
				</div>
			</DisclosurePanel>

		</Disclosure>

	)

}
