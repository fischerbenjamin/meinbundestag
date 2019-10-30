.PHONY: pdf clean

pdf: main.tex
	xelatex --output-directory=build main.tex
	cp build/main.pdf .

clean:
	rm -f build/*