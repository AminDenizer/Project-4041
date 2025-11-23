export const parseMarkdownToHtml = (markdownText) => {
    if (!markdownText) return '';

    let htmlOutput = [];
    let lines = markdownText.split('\n');
    let listStack = []; // Stores { type: 'ul'/'ol', indent: number }
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeLanguage = '';

    // Regex for specific bold labels at the start of a line
    const labelBoldRegex = /^(ریسک|توضیح|راهکار|تعریف دامنه|سندسازی|ارتباط مستمر|مدیریت تغییرات|ارزیابی تاثیر|مذاکره با ذینفعان|تحقیق و بررسی|آزمایش و نمونه‌سازی|مشورت با متخصصان|تکنیک‌های تخمین|احتیاط|بازبینی مداوم|ارتباط باز و شفاف|جلسات منظم|ابزارهای ارتباطی|تعریف معیارهای کیفیت|بررسی و آزمون|بازخورد ذینفعان|حفظ انگیزه تیم):/g;

    const closeListsUntilIndent = (currentIndent) => {
        while (listStack.length > 0 && listStack[listStack.length - 1].indent >= currentIndent) {
            const lastList = listStack.pop();
            htmlOutput.push(`</${lastList.type}>`);
        }
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmedLine = line.trimStart(); // Only trim leading spaces
        let indent = line.match(/^\s*/)[0].length; // Get actual leading whitespace length

        // Handle code blocks
        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                inCodeBlock = false;
                htmlOutput.push(`<pre><code class="language-${codeLanguage}">${codeBlockContent.join('\n')}</code></pre>`);
                codeBlockContent = [];
                codeLanguage = '';
            } else {
                inCodeBlock = true;
                codeLanguage = trimmedLine.substring(3).trim(); // Extract language from ```lang
                closeListsUntilIndent(-1); // Close any open lists before a code block
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            continue;
        }

        // Handle blank lines
        if (trimmedLine === '') {
            closeListsUntilIndent(-1); // Close all open lists on a blank line
            htmlOutput.push('<p><br/></p>'); // Add a paragraph break for spacing
            continue;
        }

        let isUnorderedListItem = trimmedLine.startsWith('* ');
        let isOrderedListItem = trimmedLine.match(/^\d+\.\s/); // e.g., "1. " or "10. "

        if (isUnorderedListItem || isOrderedListItem) {
            let listItemContent;
            let listItemTag;

            if (isUnorderedListItem) {
                listItemContent = trimmedLine.substring(2);
                listItemTag = 'ul';
            } else { // isOrderedListItem
                listItemContent = trimmedLine.replace(/^\d+\.\s*/, '');
                listItemTag = 'ol';
            }

            closeListsUntilIndent(indent); // Close lists with higher or equal indent

            // If no list is open or a new type/indent list starts
            if (listStack.length === 0 || listStack[listStack.length - 1].type !== listItemTag || listStack[listStack.length - 1].indent < indent) {
                htmlOutput.push(`<${listItemTag}>`);
                listStack.push({ type: listItemTag, indent: indent });
            }

            // Apply bold to specific labels and general **bold** markdown within list item
            listItemContent = listItemContent.replace(labelBoldRegex, '<strong>$1:</strong>');
            listItemContent = listItemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            htmlOutput.push(`<li>${listItemContent}</li>`);

        } else {
            closeListsUntilIndent(-1); // Close all lists if not a list item

            // Handle headings
            if (trimmedLine.startsWith('### ')) {
                htmlOutput.push(`<h3>${trimmedLine.substring(4)}</h3>`);
            } else if (trimmedLine.startsWith('## ')) {
                htmlOutput.push(`<h2>${trimmedLine.substring(3)}</h2>`);
            } else if (trimmedLine.startsWith('# ')) {
                htmlOutput.push(`<h1>${trimmedLine.substring(2)}</h1>`);
            }
            // Handle paragraphs and bold markdown
            else {
                let content = trimmedLine;
                content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // General bold markdown
                htmlOutput.push(`<p>${content}</p>`);
            }
        }
    }

    closeListsUntilIndent(-1); // Close any remaining open lists at the end of the document

    return htmlOutput.join('');
};
