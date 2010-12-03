TEMPLATES = $(wildcard *.soy)
TARGETS = $(TEMPLATES:.soy=.js)

%.js: %.soy
	java -jar ../lib/SoyToJsSrcCompiler.jar  --outputPathFormat $@ $<

all: $(TARGETS)
