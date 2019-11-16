CJK_FONT=AR PL UMing TW
PANDOC_OPTIONS=-V geometry:margin=1.5in

# Pandoc uses rsvg-convert to embed SVG in PDF files.
# Make sure that command is installed.

papers : short_paper.pdf design_paper.pdf

short_paper.pdf : short_paper.md
	pandoc $(PANDOC_OPTIONS) -o short_paper.pdf short_paper.md
design_paper.pdf : design_paper.md
	# the design paper has some ideographs
	pandoc $(PANDOC_OPTIONS) -V CJKmainfont="$(CJK_FONT)" --pdf-engine=xelatex -o design_paper.pdf design_paper.md
