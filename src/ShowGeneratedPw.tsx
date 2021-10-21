import * as React from 'react';
import * as m13TKReact from '@mgn901/m13tk-react';

interface PropsShowGeneratedPw {
	langs: m13TKReact.Lang[],
	generatedPw: string
}

export const ShowGeneratedPw: React.FC<PropsShowGeneratedPw> = ({ langs, generatedPw }) => {
	const [showAll, setShowAll] = React.useState(false);
	const handleShowAll = () => {
		setShowAll(true);
	}
	const dictSrc = {
		'button.head': {
			'ja': 'コピーされていませんか?',
			'en-us': 'Wasn’t copied?',
		},
		'button.body': {
			'ja': '生成されたパスワードを表示',
			'en-us': 'Show the Generated Password',
		},
		'head': {
			'ja': '生成されたパスワード',
			'en-us': 'The generated password is…',
		},
	};
	const dict = m13TKReact.useDict<keyof typeof dictSrc, string>({
		fallback: 'en-us',
		preferences: langs,
		src: dictSrc,
	})
	if (showAll) {
		return <div className='tkcnt-y tkm-3 tkpx-3 tkb-normal tkr-2'>
			<span className='tkcnt-x tktxt-small'>{dict.head}</span>
			<span className='tkcnt-txt tktxt-code'>{generatedPw}</span>
		</div>
	} else {
		return <button
			className='tkcnt-y tkbtn-normal tkm-3 tkpx-3'
			onClick={handleShowAll}>
			<span className='tkcnt-x tktxt-small'>{dict['button.head']}</span>
			<span className='tkcnt-x tktxt'>{dict['button.body']}</span>
		</button>
	}
}
