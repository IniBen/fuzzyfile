
// const fuzzylite = require('fuzzylite');
// const { message } = require('../utility/aResponse'); 
const Drugs = require("../models/drugs");
const fuzzyLogic = require('fuzzylogic/lib/fuzzylogic'); // Replace with the actual package name
const fuzzyrules = require('fuzzylogic/lib/rules'); // Replace with the actual package name
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


// async function drugPriceComparison(req, res) {
//     var aResponse = {
//         successful: false,
//         data: null,
//         message: null,
//     };

//     try {
//         // Create a new fuzzy logic engine
//         const engine = new fuzzylite;



//         // Define input variables for ingredient1
//         const ingredientInput1 = new fuzzylite.InputVariable();
//         ingredientInput1.setName('ingredient1');

//         ingredientInput1.addTerm(new fuzzylite.Triangle('common', 0, 1, 2));
//         ingredientInput1.addTerm(new fuzzylite.Triangle('rare', 1, 2, 3));
//         ingredientInput1.addTerm(new fuzzylite.Triangle('very_rare', 2, 3, 4));
//         engine.addInputVariable(ingredientInput1);

//         // Define input variables for ingredient2
//         // const ingredientInput2 = new fuzzylite.InputVariable();
//         // ingredientInput2.setName('ingredient2');

//         // ingredientInput2.addTerm(new fuzzylite.Triangle('common', 0, 1, 2));
//         // ingredientInput2.addTerm(new fuzzylite.Triangle('rare', 1, 2, 3));
//         // ingredientInput2.addTerm(new fuzzylite.Triangle('very_rare', 2, 3, 4));
//         // engine.addInputVariable(ingredientInput2);


//         // Define input variables for price1
//         const priceInput1 = new fuzzylite.InputVariable();
//         priceInput1.setName('price1');
//         priceInput1.addTerm(new fuzzylite.Triangle('low', 0, 50, 100));
//         priceInput1.addTerm(new fuzzylite.Triangle('medium', 50, 100, 150));
//         priceInput1.addTerm(new fuzzylite.Triangle('high', 100, 150, 200));
//         engine.addInputVariable(priceInput1);

//         // Define input variables for price2  
//         const priceInput2 = new fuzzylite.InputVariable();
//         priceInput2.setName('price2');
//         priceInput2.addTerm(new fuzzylite.Triangle('low', 0, 50, 100));
//         priceInput2.addTerm(new fuzzylite.Triangle('medium', 50, 100, 150));
//         priceInput2.addTerm(new fuzzylite.Triangle('high', 100, 150, 200));
//         engine.addInputVariable(priceInput2);

//         // Define output variable
//         const output = new fuzzylite.OutputVariable();
//         output.name = 'comparison';
//         output.addTerm(new fuzzylite.Triangle('affordable', 0, 25, 50));
//         output.addTerm(new fuzzylite.Triangle('expensive', 25, 50, 75));
//         output.addTerm(new fuzzylite.Triangle('very_expensive', 50, 75, 100));
//         engine.addOutputVariable(output);


//         // Define rules
//         const ruleBlock = new fuzzylite.RuleBlock();
//         ruleBlock.setName('');
//         ruleBlock.setEnabled(true);
//         ruleBlock.setConjunction(new fuzzylite.Minimum);
//         ruleBlock.setDisjunction(new fuzzylite.Maximum);
//         ruleBlock.setActivation(new fuzzylite.Minimum);

//         ruleBlock.addRule(new fuzzylite.Rule('if ingredient is common and price is low then comparison is affordable', engine));
//         ruleBlock.addRule(new fuzzylite.Rule('if ingredient is rare and price is medium then comparison is expensive', engine));
//         ruleBlock.addRule(new fuzzylite.Rule('if ingredient is very_rare and price is high then comparison is very_expensive', engine));
//         engine.addRuleBlock(ruleBlock);

//         // Set inputs and evaluate for drug 1
//         ingredientInput1.setInput(req.body.ingredientInput1);
//         priceInput1.setInput(req.body.priceInput1);

//         // Set inputs and evaluate for drug 2
//         ingredientInput2.setInput(req.body.ingredientInput2);
//         priceInput2.setInput(req.body.priceInput2);

//         engine.process();

//         const fuzzyresult = output.defuzzify();

//         const drugs = new Drugs({
//             // Modify these fields to match your data structure
//             ingredientInput1: req.body.ingredientInput1,
//             priceInput1: req.body.priceInput1,
//             ingredientInput2: req.body.ingredientInput2,
//             priceInput2: req.body.priceInput2,
//             // Add other relevant fields
//         });
//         const savedDrug = await drugs.save();


//         res.status(200).json({
//             message: "Drug added successfully",
//             fuzzyResult: fuzzyresult,
//             savedDrug: savedDrug,
//         });

//         aResponse.data = fuzzyresult;
//         aResponse.successful = true;
//         aResponse.message = "fuzzification done succesfully";

//     }
//     catch (error) {
//         console.error("the actual error wey Chelsea get LOL: ", error);
//         console.log(error)
//         res.status(500).json({
//             message: error,
//             error: error,
//         });
//         aResponse.message = error;
//     }
//     // res.send(aResponse);

// }


async function drugPriceComp(req, res) {

    const drugAPrice = req.body.drugA;
    const  drugBPrice  = req.body.drugB;
    

  if (!drugAPrice || !drugBPrice) {
    return res.status(400).json({ error: 'Both drugAPrice and drugBPrice are required query parameters.' });
  }

  const drugAMembership = {
    low: lowPrice(parseFloat(drugAPrice)),
    medium: mediumPrice(parseFloat(drugAPrice)),
    high: highPrice(parseFloat(drugAPrice)),
  };

  const drugBMembership = {
    low: lowPrice(parseFloat(drugBPrice)),
    medium: mediumPrice(parseFloat(drugBPrice)),
    high: highPrice(parseFloat(drugBPrice)),
  };

  const substituteDegree = fuzzyLogic.and(
    drugAMembership.medium,
    drugBMembership.medium
  );

  const substitutionThreshold = 0.6;

  if (substituteDegree >= substitutionThreshold) {
    res.json({ result: 'Drug A can be a substitute for Drug B.' });
  } else {
    res.json({ result: 'Drug A is not a substitute for Drug B.' });
  }
}



module.exports = { drugPriceComp };
