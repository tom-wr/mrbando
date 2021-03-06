const Alexa = require('ask-sdk-core');
const MrBando = require('./src/mr-bando.js');

function gen() {
    return new Promise((resolve, reject) => {
        setTimeout(async ()=>{
            const name = await MrBando.generate();
            resolve(name)
        }, 3000);
    });
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to the Mr Bando! What is your desire?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Mr Bando - band name generator', speechText)
            .getResponse();
    },
};

const GenerateOneHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GenerateOne';
    },
    async handle(handlerInput) {
        const speechText = await MrBando.generate();

        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Your band name is...', speechText)
        .getResponse();
    }
}

const GenerateManyHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GenerateMany';
    },
    handle(handlerInput) {
        const speechText = 'Feature not yet available';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Your band names are...', speechText)
            .getResponse();
    }
}
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        GenerateManyHandler,
        GenerateOneHandler
    )
    .lambda();
