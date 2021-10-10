import * as React from 'react';

interface PropsShowGeneratedPw {
	generatedPw: string
}

export const ShowGeneratedPw: React.FC<PropsShowGeneratedPw> = ({ generatedPw }) => {
	const [showAll, setShowAll] = React.useState(false);
	const handleShowAll = () => {
		setShowAll(true);
	}
	if (showAll) {
		return <div className='tkcnt-y tkm-3 tkpx-3 tkb-normal tkr-2'>
			<span className='tkcnt-x tktxt-small'>生成されたパスワード</span>
			<span className='tkcnt-txt tktxt-code'>{generatedPw}</span>
		</div>
	} else {
		return <button
			className='tkcnt-y tkbtn-normal tkm-3 tkpx-3'
			onClick={handleShowAll}>
			<span className='tkcnt-x tktxt-small'>コピーされていませんか?</span>
			<span className='tkcnt-x tktxt'>生成されたパスワードを表示</span>
		</button>
	}
}
