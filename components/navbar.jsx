"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import { createClient } from '@/utils/pocketbase/client';
import { useRouter } from 'next/navigation';
import ThemeToggle from './themeToggle';

export default function Navbar() {
	const router = useRouter();

	const handleSignOut = async () => {
		const pb = createClient();
		pb.authStore.clear();
		document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		router.push('/login');
	}

	return (

		<Disclosure as="nav" className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 shadow-sm transition-colors duration-200">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:outline-none focus:ring-inset transition-all duration-150">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex-shrink-0 flex items-center">
							<span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">Next Frames</span>
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-1">
								<a
									href="/dashboard"
									className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150"
								>
									Dashboard
								</a>
								<a
									href="/slideshow"
									target="_blank"
									className="relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
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
							className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150"
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden border-t border-white/20 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-200">
				<div className="space-y-1 px-2 pt-2 pb-3">
					<DisclosureButton
						as="a"
						href="/dashboard"
						className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 block rounded-xl px-3 py-2 text-base font-medium transition-all duration-150"
					>
						Dashboard
					</DisclosureButton>
					<DisclosureButton
						as="a"
						href="/slideshow"
						target="_blank"
						className="text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-700 dark:hover:text-gray-300 block rounded-xl px-3 py-2 text-base font-medium transition-all duration-150"
					>
						Slideshow
					</DisclosureButton>
				</div>
			</DisclosurePanel>

		</Disclosure>

	)

}
