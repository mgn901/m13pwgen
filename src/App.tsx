import * as React from 'react';
import { ShowGeneratedPw } from './ShowGeneratedPw';

interface PropsApp {
	workerGeneratePw: Worker,
	brand?: React.ReactNode,
	about?: React.ReactNode,
}

export const App: React.FC<PropsApp> = ({ brand, about, workerGeneratePw }) => {
	const [masterPw, setMasterPw] = React.useState('');
	const [serviceName, setServiceName] = React.useState('');
	const [generatedPw, setGeneratedPw] = React.useState('');
	const [mode, setMode] = React.useState<'input' | 'generating' | 'generated'>('input');
	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const el = e.currentTarget;
		const setters = [
			{ name: 'setMasterPw', setter: setMasterPw },
			{ name: 'setServiceName', setter: setServiceName }
		];
		const setter = setters.find(setterKV => setterKV.name === el.dataset.setter).setter;
		setter(el.value);
		setMode('input');
	}
	const handleGeneratePw = () => {
		setMode('generating');
		workerGeneratePw.postMessage(masterPw + serviceName);
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
	const buttonInner = {
		input: <span className='tkchip-x tktxt tkcolor-fg0'>パスワードを生成してコピー</span>,
		generating: <>
			<span className='tkchip-x tktxt-spinner tktxt-large tkm-1 tkcolor-fg0'></span>
			<span className='tkchip-x tktxt tkcolor-fg0'>生成中……</span>
		</>,
		generated: <>
			<span className='tkchip-x tktxt-icon tktxt-large tkm-1 tkcolor-fg0'>done</span>
			<span className='tkchip-x tktxt tkcolor-fg0'>コピーされました</span>
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
				<span className='tkcnt-x tktxt-small'>マスターパスワード</span>
				<input
					type='password'
					className='tkinput-text'
					value={masterPw}
					placeholder='YourStrongPassword'
					disabled={isInputDisabled}
					onChange={handleChangeInput}
					data-setter='setMasterPw' />
			</label>
			<label className='tkcnt-y tkinputwrapper-text tkm-3 tkpx-2 tkb-normal'>
				<span className='tkcnt-x tktxt-small'>サービス名</span>
				<input
					type='password'
					className='tkinput-text'
					value={serviceName}
					placeholder='Google'
					disabled={isInputDisabled}
					onChange={handleChangeInput}
					data-setter='setServiceName' />
			</label>
			<button
				className='tkcnt-x tkbtn-normal tkcolor-pr tky-12 tkm-3 tkalign-center tkjustify-center'
				onClick={handleGeneratePw}
				disabled={mode !== 'input'}>
				{buttonInner[mode]}
			</button>
			{mode === 'generated' && <ShowGeneratedPw generatedPw={generatedPw} />}
		</main>
	</div>;
}
