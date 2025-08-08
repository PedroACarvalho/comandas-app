#!/usr/bin/env python3
"""
Script para converter o documento Markdown em HTML bem formatado
"""

import markdown2
import os
from datetime import datetime

def create_html_from_markdown(markdown_file):
    """Converte arquivo Markdown em HTML"""
    with open(markdown_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Converter Markdown para HTML
    html_content = markdown2.markdown(
        markdown_content,
        extras=[
            'tables',
            'fenced-code-blocks',
            'code-friendly',
            'cuddled-lists',
            'header-ids',
            'toc'
        ]
    )
    
    # Criar HTML completo com CSS
    html_template = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Comandas Online - Documentação Completa</title>
        <style>
            @media print {{
                @page {{
                    size: A4;
                    margin: 2cm;
                }}
                
                body {{
                    font-size: 12pt;
                    line-height: 1.4;
                }}
                
                h1 {{ font-size: 18pt; }}
                h2 {{ font-size: 16pt; }}
                h3 {{ font-size: 14pt; }}
                h4 {{ font-size: 13pt; }}
                
                pre, code {{
                    font-size: 10pt;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }}
                
                .page-break {{
                    page-break-before: always;
                }}
                
                .no-break {{
                    page-break-inside: avoid;
                }}
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
            }}
            
            .header {{
                text-align: center;
                border-bottom: 3px solid #3498db;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }}
            
            .header h1 {{
                color: #2c3e50;
                margin: 0;
                font-size: 2.5em;
            }}
            
            .header .subtitle {{
                color: #7f8c8d;
                font-size: 1.2em;
                margin-top: 10px;
            }}
            
            .header .meta {{
                color: #95a5a6;
                font-size: 0.9em;
                margin-top: 10px;
            }}
            
            h1 {{
                color: #2c3e50;
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
                margin-top: 40px;
                margin-bottom: 20px;
            }}
            
            h2 {{
                color: #34495e;
                border-bottom: 2px solid #bdc3c7;
                padding-bottom: 5px;
                margin-top: 30px;
                margin-bottom: 15px;
            }}
            
            h3 {{
                color: #2c3e50;
                margin-top: 25px;
                margin-bottom: 10px;
            }}
            
            h4, h5, h6 {{
                color: #34495e;
                margin-top: 20px;
                margin-bottom: 10px;
            }}
            
            code {{
                background-color: #f8f9fa;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #e74c3c;
            }}
            
            pre {{
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 5px;
                padding: 15px;
                overflow-x: auto;
                margin: 15px 0;
            }}
            
            pre code {{
                background-color: transparent;
                padding: 0;
                color: #333;
            }}
            
            blockquote {{
                border-left: 4px solid #3498db;
                margin: 20px 0;
                padding-left: 20px;
                color: #666;
                font-style: italic;
            }}
            
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 20px 0;
                font-size: 0.9em;
            }}
            
            th, td {{
                border: 1px solid #ddd;
                padding: 8px 12px;
                text-align: left;
            }}
            
            th {{
                background-color: #f8f9fa;
                font-weight: bold;
                color: #2c3e50;
            }}
            
            tr:nth-child(even) {{
                background-color: #f9f9f9;
            }}
            
            ul, ol {{
                padding-left: 20px;
            }}
            
            li {{
                margin-bottom: 5px;
            }}
            
            a {{
                color: #3498db;
                text-decoration: none;
            }}
            
            a:hover {{
                text-decoration: underline;
            }}
            
            .toc {{
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
            }}
            
            .toc h2 {{
                margin-top: 0;
                border-bottom: none;
            }}
            
            .toc ul {{
                list-style-type: none;
                padding-left: 0;
            }}
            
            .toc li {{
                margin-bottom: 8px;
            }}
            
            .toc a {{
                color: #2c3e50;
                text-decoration: none;
            }}
            
            .toc a:hover {{
                color: #3498db;
            }}
            
            .emoji {{
                font-size: 1.2em;
            }}
            
            .highlight {{
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 3px;
                padding: 10px;
                margin: 10px 0;
            }}
            
            .success {{
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 3px;
                padding: 10px;
                margin: 10px 0;
                color: #155724;
            }}
            
            .warning {{
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 3px;
                padding: 10px;
                margin: 10px 0;
                color: #856404;
            }}
            
            .info {{
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 3px;
                padding: 10px;
                margin: 10px 0;
                color: #0c5460;
            }}
            
            .page-break {{
                page-break-before: always;
            }}
            
            .no-break {{
                page-break-inside: avoid;
            }}
            
            .footer {{
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #95a5a6;
                font-size: 0.9em;
            }}
            
            @media screen {{
                body {{
                    font-size: 14px;
                }}
                
                pre {{
                    max-width: 100%;
                    overflow-x: auto;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📚 Sistema de Comandas Online</h1>
            <div class="subtitle">Documentação Completa</div>
            <div class="meta">
                <strong>Autor:</strong> Pedro Augusto Carvalho<br>
                <strong>Versão:</strong> 1.0.0<br>
                <strong>Data:</strong> {datetime.now().strftime('%d/%m/%Y')}<br>
                <strong>Projeto:</strong> TCC - Sistema de Comandas Online
            </div>
        </div>
        
        <div class="content">
            {html_content}
        </div>
        
        <div class="footer">
            <p>🎉 Sistema 100% Funcional e Documentado!</p>
            <p>Esta documentação fornece todos os detalhes necessários para entender, instalar, configurar e manter o Sistema de Comandas Online.</p>
            <p><strong>Última atualização:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
        </div>
    </body>
    </html>
    """
    
    return html_template

def convert_markdown_to_html(markdown_file, output_file):
    """Converte arquivo Markdown em HTML"""
    print(f"Convertendo {markdown_file} para HTML...")
    
    # Criar HTML
    html_content = create_html_from_markdown(markdown_file)
    
    try:
        # Salvar HTML
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ HTML criado com sucesso: {output_file}")
        
        # Mostrar informações do arquivo
        file_size = os.path.getsize(output_file) / 1024  # KB
        print(f"📄 Tamanho do arquivo: {file_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar HTML: {e}")
        return False

def main():
    """Função principal"""
    markdown_file = "DOCUMENTACAO_COMPLETA.md"
    html_file = "Sistema_Comandas_Online_Documentacao_Completa.html"
    pdf_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
    
    # Verificar se o arquivo Markdown existe
    if not os.path.exists(markdown_file):
        print(f"❌ Arquivo {markdown_file} não encontrado!")
        return
    
    print("🚀 Iniciando conversão de Markdown para HTML...")
    print(f"📖 Arquivo de entrada: {markdown_file}")
    print(f"📄 Arquivo de saída HTML: {html_file}")
    print("-" * 50)
    
    # Converter
    success = convert_markdown_to_html(markdown_file, html_file)
    
    if success:
        print("-" * 50)
        print("🎉 Conversão concluída com sucesso!")
        print(f"📚 Documentação HTML salva em: {html_file}")
        print(f"📅 Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        print("\n📋 Para converter para PDF:")
        print("1. Abra o arquivo HTML no navegador")
        print("2. Use Ctrl+P (ou Cmd+P no Mac)")
        print("3. Salve como PDF")
        print(f"\n🌐 Arquivo HTML: {os.path.abspath(html_file)}")
    else:
        print("❌ Falha na conversão!")

if __name__ == "__main__":
    main()
