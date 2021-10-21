import * as React from 'react';
import * as m13TKReact from '@mgn901/m13tk-react';
import { ShowGeneratedPw } from './ShowGeneratedPw';

interface PropsApp {
	langs: m13TKReact.Lang[],
	workerGeneratePw: Worker,
	brand?: React.ReactNode,
	about?: React.ReactNode,
}

export const App: React.FC<PropsApp> = ({ langs, brand, about, workerGeneratePw }) => {
	const [secret, setSecret] = React.useState('');
	const [name, setName] = React.useState('');
	const [generatedPw, setGeneratedPw] = React.useState('');
	const [mode, setMode] = React.useState<'input' | 'generating' | 'generated'>('input');
	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const el = e.currentTarget;
		const setters = [
			{ name: 'setMasterPw', setter: setSecret },
			{ name: 'setServiceName', setter: setName },
		];
		const setter = setters.find(setterKV => setterKV.name === el.dataset.setter).setter;
		setter(el.value);
		setMode('input');
	}
	const handleGeneratePw = () => {
		setMode('generating');
		workerGeneratePw.postMessage(secret + name);
	}
	const handleMessage = (e: MessageEvent<string>) => {
		setGeneratedPw(e.data);
		setMode('generated');
		navigator.clipboard.writeText(e.data);
	}
	React.useEffect(() => {
		console.log('初期化');
		workerGeneratePw.addEventListener('message', handleMessage);
		return () => {
			workerGeneratePw.removeEventListener('message', handleMessage);
			workerGeneratePw.terminate();
		}
	}, []);
	const dictSrc = {
		'buttonInner.input': {
			'ja': 'パスワードを生成してコピー',
			'en-us': 'Generate and Copy the Password',
		},
		'buttonInner.generating': {
			'ja': '生成中……',
			'en-us': 'Generating…',
		},
		'buttonInner.generated': {
			'ja': 'コピーされました',
			'en-us': 'Copied'
		},
		'input.secret': {
			'ja': 'ひみつの文字列',
			'en-us': 'Your Secret String',
		},
		'input.name': {
			'ja': '生成されるパスワードの名前',
			'en-us': 'Name of the Generated Password',
		},
	};
	const dict = m13TKReact.useDict<keyof typeof dictSrc, string>({
		fallback: 'en-us',
		preferences: langs,
		src: dictSrc,
	});
	const buttonInner = {
		input: <span className='tkchip-x tktxt tkcolor-fg0'>{dict['buttonInner.input']}</span>,
		generating: <>
			<m13TKReact.Spinner props={{'aria-hidden': true, className: 'tkm-2 tkcolor-fg0'}} />
			<span className='tkchip-x tktxt tkcolor-fg0'>{dict['buttonInner.generating']}</span>
		</>,
		generated: <>
			<m13TKReact.Icon name='done' props={{'aria-hidden': true, className: 'tkm-2 tkcolor-fg0'}} />
			<span className='tkchip-x tktxt tkcolor-fg0'>{dict['buttonInner.generated']}</span>
		</>,
	};
	const isInputDisabled = mode === 'generating';
	return <div className='tkcnt-y tkalign-center'>
		<header className='tkcnt-x tksticky-top tkjustify-center tkpy-3 tkshadow-2'>
			<div className='tkcnt-x tkx-120 tkpx-4 tkjustify-between'>
				{brand}
				{about}
			</div>
		</header>
		<main className='tkcnt-y tkx-120 tkm-6 tkpx-4 tkpy-6 tkalign-center'>
			<label className='tkcnt-y tkinputwrapper-text tkm-3 tkpx-2 tkb-normal'>
				<span className='tkcnt-x tktxt-small'>{dict['input.secret']}</span>
				<input
					type='password'
					className='tkinput-text'
					value={secret}
					placeholder='YourStrongPassword'
					disabled={isInputDisabled}
					onChange={handleChangeInput}
					data-setter='setMasterPw' />
			</label>
			<label className='tkcnt-y tkinputwrapper-text tkm-3 tkpx-2 tkb-normal'>
				<span className='tkcnt-x tktxt-small'>{dict['input.name']}</span>
				<input
					type='password'
					className='tkinput-text'
					value={name}
					placeholder='example@gmail.com'
					disabled={isInputDisabled}
					onChange={handleChangeInput}
					data-setter='setServiceName' />
			</label>
			<button
				aria-live={mode !== 'input' ? 'assertive' : 'off'}
				className='tkcnt-x tkbtn-normal tkcolor-pr tkp-3 tkm-3 tkjustify-center'
				onClick={handleGeneratePw}
				disabled={mode !== 'input'}>
				{buttonInner[mode]}
			</button>
			{mode === 'generated' && <ShowGeneratedPw langs={langs} generatedPw={generatedPw} />}
		</main>
	</div>;
}
