import * as m13TKReact from '@mgn901/m13tk-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '@mgn901/m13tk/css/style.css';
import '@mgn901/m13tk-react/css/style.css';
import { App } from '../src/App';

const brand = <h1 className='tkchip-x tktxt-heading'>m13PwGen</h1>;

const About: React.FC = () => {
	const { isOpened, trigger, open, close } = m13TKReact.usePopover();
	return <>
		{/* <button
			className='tkchip-x tkbtn-normal tkpx-2'
			onClick={open}>
			<span className='tktxt-icon'>more_vert</span>
		</button>
		<m13TKReact.PopoverContainer
			isOpened={isOpened}
			trigger={trigger}
			close={close}
			props={{ className: 'tkcnt-y tkx-80 tkp-3' }}>
			<div className='tkcnt-y tkm-3 tkr-2 tkb-normal'>
				<button className='tkcnt-x tkbtn-flat tkr-2'>
					<span className='tkchip-x tktxt tkpx-2'>このWebアプリについて</span>
				</button>
			</div>
		</m13TKReact.PopoverContainer> */}
	</>
}

const workerGeneratePw = new Worker('./worker-generatePw/index.js');

const rendered = <m13TKReact.ProviderPopoverContext>
	<App brand={brand} about={<About />} workerGeneratePw={workerGeneratePw} />
	<m13TKReact.PopoverRenderer />
</m13TKReact.ProviderPopoverContext>

ReactDOM.render(rendered, document.getElementById('m13pwgen'));
