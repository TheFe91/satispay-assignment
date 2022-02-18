const aliases = (prefix = "src") => ({
	"@Src": `${prefix}`,
	"@Api": `${prefix}/api`,
	"@Assets": `${prefix}/assets`,
	"@Components": `${prefix}/components`,
	"@Images": `${prefix}/assets/images`,
	"@State": `${prefix}/store/state`,
	"@Utils": `${prefix}/utils`,
});

module.exports = aliases;
