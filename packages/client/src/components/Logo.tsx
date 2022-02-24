import React from 'react';

const LOGO_URL: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png';

function Logo() {
  return (
    <div className="logo-container">
      <img
        alt="logo"
        className="logo-img"
        src={LOGO_URL}
      />

      <p style={{ fontStyle: 'italic' }}>by Alessandro Defendenti for Satispay</p>
    </div>
  );
}

export default Logo;
