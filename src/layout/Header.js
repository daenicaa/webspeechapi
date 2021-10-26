import React from "react";
import { NavLink } from "react-router-dom";

function Header(){
	const menus = [
		{ path: '/', text: 'Home' },
		{ path: 'consents', text: 'Consents' }
	]

	return (
		<header>
	    <div className="menu">
			{menus.map((menu, index) => (
				<NavLink
					exact={true} activeClassName='active'
	        to={ menu.path }
	        key={`header-menu-${index}`}>
	        { menu.text }
	      </NavLink>
			))}
	    </div>
	  </header>
	);
}

export default Header;
