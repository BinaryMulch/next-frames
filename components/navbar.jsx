"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ThemeToggle from './themeToggle';

export default function Navbar() {
	const router = useRouter();

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push('/login');
	}

	return (

		<Disclosure as="nav" className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset transition-colors">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex-shrink-0 flex items-center">
							<span className="text-xl font-bold text-gray-800 dark:text-white">Next Frames</span>
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-1">
								<a
									href="/dashboard"
									className='bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
								>
									Dashboard
								</a>
								<a
									href="/slideshow"
									target="_blank"
									className='text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
								>
									Slideshow
								</a>
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-2">
						<ThemeToggle />
						<button
							onClick={handleSignOut}
							className='text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
				<div className="space-y-1 px-2 pt-2 pb-3">
					<DisclosureButton
						as="a"
						href="/dashboard"
						className='bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 block rounded-lg px-3 py-2 text-base font-medium transition-colors'
					>
						Dashboard
					</DisclosureButton>
					<DisclosureButton
						as="a"
						href="/slideshow"
						target="_blank"
						className='text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 block rounded-lg px-3 py-2 text-base font-medium transition-colors'
					>
						Slideshow
					</DisclosureButton>
				</div>
			</DisclosurePanel>

		</Disclosure>

	)

}
