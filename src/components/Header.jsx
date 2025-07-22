import React from 'react';
import { Button } from './ui/button';
import { Menu, Bell, User } from 'lucide-react';

/**
 * Header: Barra superior do sistema, exibe botões de menu, notificações e usuário.
 * @param {function} onMenuClick - Função chamada ao clicar no menu (mobile).
 */
const Header = ({ onMenuClick }) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 