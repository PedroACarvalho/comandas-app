#!/usr/bin/env python3
"""
Script para gerar PDF da documentação usando diferentes métodos
"""

import os
import subprocess
import sys
from datetime import datetime

def try_pandoc():
    """Tenta usar pandoc para converter HTML para PDF"""
    try:
        html_file = "Sistema_Comandas_Online_Documentacao_Completa.html"
        pdf_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
        
        if not os.path.exists(html_file):
            print("❌ Arquivo HTML não encontrado!")
            return False
        
        print("🔄 Tentando converter com pandoc...")
        result = subprocess.run([
            'pandoc', 
            html_file, 
            '-o', pdf_file,
            '--pdf-engine=wkhtmltopdf',
            '--standalone'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ PDF criado com pandoc: {pdf_file}")
            return True
        else:
            print(f"❌ Erro com pandoc: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ Pandoc não encontrado")
        return False

def try_wkhtmltopdf():
    """Tenta usar wkhtmltopdf diretamente"""
    try:
        html_file = "Sistema_Comandas_Online_Documentacao_Completa.html"
        pdf_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
        
        if not os.path.exists(html_file):
            print("❌ Arquivo HTML não encontrado!")
            return False
        
        print("🔄 Tentando converter com wkhtmltopdf...")
        result = subprocess.run([
            'wkhtmltopdf',
            '--page-size', 'A4',
            '--margin-top', '20mm',
            '--margin-right', '20mm',
            '--margin-bottom', '20mm',
            '--margin-left', '20mm',
            '--encoding', 'UTF-8',
            html_file,
            pdf_file
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ PDF criado com wkhtmltopdf: {pdf_file}")
            return True
        else:
            print(f"❌ Erro com wkhtmltopdf: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ wkhtmltopdf não encontrado")
        return False

def try_chrome_headless():
    """Tenta usar Chrome em modo headless"""
    try:
        html_file = os.path.abspath("Sistema_Comandas_Online_Documentacao_Completa.html")
        pdf_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
        
        if not os.path.exists(html_file):
            print("❌ Arquivo HTML não encontrado!")
            return False
        
        print("🔄 Tentando converter com Chrome headless...")
        result = subprocess.run([
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '--headless',
            '--disable-gpu',
            '--print-to-pdf=' + os.path.abspath(pdf_file),
            '--print-to-pdf-no-header',
            'file://' + html_file
        ], capture_output=True, text=True)
        
        if result.returncode == 0 and os.path.exists(pdf_file):
            print(f"✅ PDF criado com Chrome: {pdf_file}")
            return True
        else:
            print(f"❌ Erro com Chrome: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ Chrome não encontrado")
        return False

def try_safari_automation():
    """Tenta usar Safari via AppleScript"""
    try:
        html_file = os.path.abspath("Sistema_Comandas_Online_Documentacao_Completa.html")
        pdf_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
        
        if not os.path.exists(html_file):
            print("❌ Arquivo HTML não encontrado!")
            return False
        
        print("🔄 Tentando converter com Safari...")
        
        # AppleScript para abrir no Safari e imprimir
        script = f'''
        tell application "Safari"
            activate
            open location "file://{html_file}"
            delay 2
            tell application "System Events"
                keystroke "p" using command down
                delay 1
                keystroke return
                delay 2
                keystroke return
            end tell
        end tell
        '''
        
        result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Comando Safari executado (verifique se o PDF foi salvo)")
            return True
        else:
            print(f"❌ Erro com Safari: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Erro com Safari: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Tentando gerar PDF da documentação...")
    print("=" * 50)
    
    # Verificar se o arquivo HTML existe
    html_file = "Sistema_Comandas_Online_Documentacao_Completa.html"
    if not os.path.exists(html_file):
        print(f"❌ Arquivo {html_file} não encontrado!")
        print("Execute primeiro: python3 convert_to_html.py")
        return
    
    # Tentar diferentes métodos
    methods = [
        ("Pandoc", try_pandoc),
        ("wkhtmltopdf", try_wkhtmltopdf),
        ("Chrome Headless", try_chrome_headless),
        ("Safari", try_safari_automation)
    ]
    
    success = False
    for name, method in methods:
        print(f"\n🔄 Tentando método: {name}")
        print("-" * 30)
        
        if method():
            success = True
            break
        else:
            print(f"❌ Método {name} falhou")
    
    if success:
        print("\n🎉 PDF gerado com sucesso!")
        print("📄 Arquivo: Sistema_Comandas_Online_Documentacao_Completa.pdf")
    else:
        print("\n❌ Todos os métodos falharam!")
        print("\n📋 Alternativa manual:")
        print("1. Abra o arquivo HTML no navegador")
        print("2. Use Cmd+P (Mac) ou Ctrl+P (Windows/Linux)")
        print("3. Salve como PDF")
        print(f"\n🌐 Arquivo HTML: {os.path.abspath(html_file)}")

if __name__ == "__main__":
    main()
