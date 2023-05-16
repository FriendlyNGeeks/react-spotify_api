import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

export default function BasicMenu(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        variant="outlined"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/authorize">Authorize</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/status">Status</MenuItem>
        {props.data.refresh_token && <MenuItem onClick={handleClose} component={Link} to="/spotify">Play</MenuItem>}
      </Menu>
    </div>
  );
}