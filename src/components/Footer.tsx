import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const links = [
	{ href: 'https://allejo.io', text: '@allejo' },
	{
		href: 'https://github.com/allejo/json-reshaper',
		text: 'GitHub',
		icon: faGithub,
	},
	{
		href: 'https://github.com/sponsors/allejo',
		text: 'Sponsor',
		icon: faHeart,
		iconClass: 'text-red-500',
	},
];

export const Footer = () => (
	<footer className="grid grid-cols-2">
		<div>
			<span className="text-slate-500">
				Copyright &copy; {new Date().getFullYear()}
			</span>
			{links.map(({ href, text, icon, iconClass }, index) => (
				<a
					key={index}
					href={href}
					target="_blank"
					className="inline-block ml-4 font-bold text-slate-800 underline cursor-pointer"
				>
					{icon && (
						<FontAwesomeIcon
							icon={icon}
							className={`${iconClass ?? ''} mr-1`}
						/>
					)}
					{text}
				</a>
			))}
		</div>
	</footer>
);
