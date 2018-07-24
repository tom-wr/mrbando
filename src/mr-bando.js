const api_key = require('./config.js').api_key;
const request = require('request');
const _ = require('lodash');


const base_options = {
    uri: 'https://api.wordnik.com/v4/words.json/randomWord',
    qs: {
        hasDictionaryDef: true,
        minCorpusCount: 5000,
        maxCorpusCount: -1,
        minDictionaryCount: 0,
        maxDictionaryCount: -1,
        minLength: 5,
        maxLength: 10,
        api_key: 'd83c0156c03e9a810dc260faeaa0319166110b658b68b3d84',
    },
    json: true
}

const Word = (type, base_options) => {
    return _.merge({ 'qs': { 'includePartOfSpeech': type} }, base_options);
}

const WordRequest = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            resolve(body);
        })
    })
}

const Adjective = Word('adjective', base_options);
const Noun = Word('noun', base_options);
const Verb = Word('verb', base_options);
const AuxVerb = Word('auxiliary-verb', base_options);
const AdVerb = Word('adverb', base_options);
const Preposition = Word('preposition', base_options);
const VerbTransitive = Word('verb-transitive', base_options);
const VerbIntransitive = Word('verb-transitive', base_options);

const Templates = [
    [VerbTransitive, 'the', Noun],
    ['The', Adjective, Noun],
    ['The', Verb, 'of the', Noun],
    [Noun, 'and', Verb],
    [Verb, 'the', Noun],
    ['The', AdVerb, Adjective],
    ['The', Noun],
    //['The', Noun, AuxVerb, 'be', Verb],
]

const randomTemplate = (templates) => {
    return templates[_.random(templates.length - 1)];
}

const getTemplateSlots = (template, slots = []) => {
    for(const item of template) {
        if(typeof item === 'object') {
            slots.push(WordRequest(item));
        }
    }
    return slots;
}

const reconstructName = (originalTemplate, responseBody) => {
    let n = '';
    let slotCount = 0;
    for(const word of originalTemplate) {
        if(typeof word === 'object') {
            n += `${responseBody[slotCount].word} `;
            slotCount++;
        } else {
            n += `${word} `;
        }
    }
    return _.trim(n);
}

const generate = () => {
    const template = randomTemplate(Templates);
    const slots = getTemplateSlots(template);

    return new Promise((resolve, reject) => {
        Promise.all(slots).then((data) => {
            resolve(reconstructName(template, data));
        }).catch((err) => {
            reject('cannot be generated at this time.');
        });
    });
}


module.exports = {
    generate,
}
