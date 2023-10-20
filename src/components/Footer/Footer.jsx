import React from 'react';
import { Typography } from '@mui/material';
import LogoNDTIC from './img/Logo64_original.png';
import './estilo.css';

const Footer = () => {
    return (
        <footer className="footer">
            <Typography variant="body1" className="footer__texto">Desenvolvido pela NDTIC - SVMA </Typography>
            <img src={LogoNDTIC} alt='Logo NDTIC' className="footer__imagem" />
        </footer>
    );
}

export default Footer;