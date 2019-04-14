papers : short_paper.pdf design_paper.pdf

short_paper.pdf : short_paper.md
	pandoc -V geometry:margin=1.5in -o short_paper.pdf short_paper.md
design_paper.pdf : design_paper.md
	pandoc -V CJKmainfont='AR PL UMing TW' -V geometry:margin=1.5in --latex-engine=xelatex -o design_paper.pdf design_paper.md
