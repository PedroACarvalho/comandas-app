#!/usr/bin/env python3
"""
Script para converter o documento Markdown em PDF
"""

import markdown2
import weasyprint
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
            @page {{
                size: A4;
                margin: 2cm;
                @top-center {{
                    content: "Sistema de Comandas Online";
                    font-size: 10pt;
                    color: #666;
                }}
                @bottom-center {{
                    content: "Página " counter(page) " de " counter(pages);
                    font-size: 10pt;
                    color: #666;
                }}
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
                margin: 0;
                padding: 0;
            }}
            
            h1 {{
                color: #2c3e50;
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
                page-break-after: avoid;
            }}
            
            h2 {{
                color: #34495e;
                border-bottom: 2px solid #bdc3c7;
                padding-bottom: 5px;
                page-break-after: avoid;
            }}
            
            h3 {{
                color: #2c3e50;
                page-break-after: avoid;
            }}
            
            h4, h5, h6 {{
                color: #34495e;
                page-break-after: avoid;
            }}
            
            code {{
                background-color: #f8f9fa;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }}
            
            pre {{
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 5px;
                padding: 15px;
                overflow-x: auto;
                page-break-inside: avoid;
            }}
            
            pre code {{
                background-color: transparent;
                padding: 0;
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
                page-break-inside: avoid;
            }}
            
            th, td {{
                border: 1px solid #ddd;
                padding: 8px 12px;
                text-align: left;
            }}
            
            th {{
                background-color: #f8f9fa;
                font-weight: bold;
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
                page-break-inside: avoid;
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
            
            @media print {{
                body {{
                    font-size: 12pt;
                }}
                
                h1 {{
                    font-size: 18pt;
                }}
                
                h2 {{
                    font-size: 16pt;
                }}
                
                h3 {{
                    font-size: 14pt;
                }}
                
                code {{
                    font-size: 10pt;
                }}
                
                pre {{
                    font-size: 10pt;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="content">
            {html_content}
        </div>
    </body>
    </html>
    """
    
    return html_template

def convert_markdown_to_pdf(markdown_file, output_file):
    """Converte arquivo Markdown em PDF"""
    print(f"Convertendo {markdown_file} para PDF...")
    
    # Criar HTML
    html_content = create_html_from_markdown(markdown_file)
    
    # Salvar HTML temporário
    temp_html_file = "temp_documentation.html"
    with open(temp_html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    try:
        # Converter HTML para PDF
        weasyprint.HTML(string=html_content).write_pdf(output_file)
        print(f"✅ PDF criado com sucesso: {output_file}")
        
        # Mostrar informações do arquivo
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
        print(f"📄 Tamanho do arquivo: {file_size:.2f} MB")
        
    except Exception as e:
        print(f"❌ Erro ao criar PDF: {e}")
        return False
    
    finally:
        # Limpar arquivo temporário
        if os.path.exists(temp_html_file):
            os.remove(temp_html_file)
    
    return True

def main():
    """Função principal"""
    markdown_file = "DOCUMENTACAO_COMPLETA.md"
    output_file = "Sistema_Comandas_Online_Documentacao_Completa.pdf"
    
    # Verificar se o arquivo Markdown existe
    if not os.path.exists(markdown_file):
        print(f"❌ Arquivo {markdown_file} não encontrado!")
        return
    
    print("🚀 Iniciando conversão de Markdown para PDF...")
    print(f"📖 Arquivo de entrada: {markdown_file}")
    print(f"📄 Arquivo de saída: {output_file}")
    print("-" * 50)
    
    # Converter
    success = convert_markdown_to_pdf(markdown_file, output_file)
    
    if success:
        print("-" * 50)
        print("🎉 Conversão concluída com sucesso!")
        print(f"📚 Documentação completa salva em: {output_file}")
        print(f"📅 Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    else:
        print("❌ Falha na conversão!")

if __name__ == "__main__":
    main()
