export const Footer = () => (
	<footer className="grid grid-cols-2">
		<div>
			<span className="text-slate-500">
				Copyright &copy; {new Date().getFullYear()}
			</span>
			<a
				href="https://allejo.io"
				target="_blank"
				className="inline-block ml-4 font-bold text-slate-800 underline cursor-pointer"
			>
				@allejo
			</a>
		</div>
	</footer>
);
