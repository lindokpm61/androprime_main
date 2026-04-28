import type { ResultState } from './types'

interface BiomarkerCopy {
  stateLabel: string
  explanation: string
  educationContext: string
  recommendation: string
}

const TESTOSTERONE_EVIDENCE =
  'Testosterone is the primary male sex hormone. It affects energy, mood, sleep quality, body composition, libido, and the ability to build and maintain muscle. Levels decline naturally from the mid-thirties, roughly 1–2% per year on average. The reference range is 10–35 nmol/L, which represents a 3.5-fold difference between the floor and the ceiling. Where you sit in that range matters for how you feel day to day, not just whether you are technically deficient. Most GP panels flag only results below 10 nmol/L. That is the clinical floor, not a target.'

const SHBG_EVIDENCE =
  'Sex Hormone Binding Globulin is a protein produced primarily in the liver. It binds tightly to testosterone and to oestradiol, and carries them through the bloodstream. Testosterone bound to SHBG is biologically inactive. Only the free, unbound fraction can enter cells and have an effect. SHBG levels increase with age, which is one reason why some men experience low-testosterone symptoms even when their total testosterone appears in range. Elevated SHBG can also be associated with thyroid changes, liver function, and some medications. It does not have a direct fix; it is a marker that informs how you interpret your total and free testosterone together.'

const FREE_T_EVIDENCE =
  'Most testosterone in the blood is bound to proteins, primarily SHBG and albumin. Only around 2–3% is free and immediately available to your cells. This free fraction drives the physiological effects testosterone is known for: mood, energy, libido, muscle synthesis, and body composition. Total testosterone gives you the overall pool size. Free testosterone tells you how much is actually accessible. When SHBG is elevated, total testosterone can look acceptable while free testosterone is insufficient. The two figures together give the clearest picture of your hormonal status.'

const VITAMIN_D_EVIDENCE =
  'Vitamin D functions more like a hormone than a vitamin. The body produces it primarily through skin exposure to sunlight; dietary sources contribute very little. It regulates hundreds of biological processes, including muscle contraction, immune function, and mood. Deficiency is associated with fatigue, reduced muscle performance, and slower recovery. In the UK, Public Health England recommends Vitamin D supplementation for all adults from October to March. Many individuals, particularly those working indoors, are below adequate levels year-round. You cannot reliably gauge your Vitamin D from how you feel. Testing is the only way to know your level.'

const B12_EVIDENCE =
  'Active B12 (Holotranscobalamin) is the form of vitamin B12 that is actively transported into cells. Standard B12 tests measure total serum B12, which includes a large portion bound to proteins that cannot be used by tissues. Active B12 gives a more accurate picture of what your body actually has available. B12 is not produced by the body and must come entirely from animal-source foods: meat, fish, eggs, and dairy. Deficiency is more common in men over 40, those on plant-based diets, and those taking long-term medications including metformin or proton pump inhibitors. Low active B12 is associated with fatigue, reduced cognitive clarity, and mood changes.'

const CRP_EVIDENCE =
  'hs-CRP stands for high-sensitivity C-reactive protein. It is produced by the liver in response to inflammation anywhere in the body. Standard CRP tests are not sensitive enough to detect low-level systemic inflammation; the high-sensitivity version used here is. In active men, mildly elevated hs-CRP is often associated with insufficient recovery time, connective tissue stress, or diet-driven inflammation. However, it is not a specific marker; it can be elevated for many reasons. It is most useful as part of a broader picture and as something to track over time. A single elevated reading is not a diagnosis of any condition.'

const FERRITIN_EVIDENCE =
  'Ferritin is the primary iron storage protein in the body. Unlike serum iron, which fluctuates hour to hour, ferritin gives a reliable picture of total iron reserves. Iron is essential for producing haemoglobin, the protein in red blood cells that carries oxygen to your muscles and organs. When ferritin is low, your muscles receive less oxygen during exercise, which directly reduces performance and slows recovery. Ferritin is not routinely included in standard NHS blood panels for men, which means many men with depleted stores go undetected for years. It is also worth noting that very high ferritin can occasionally indicate inflammatory or liver-related changes, though this is uncommon and the lab flags it.'

export const BIOMARKER_COPY: Record<ResultState, BiomarkerCopy> = {
  'low-testosterone': {
    stateLabel: 'Your results indicate low testosterone',
    explanation:
      'Your total testosterone is below the level considered optimal for adult men. Levels in this range are associated with the symptoms many men describe: persistent fatigue, reduced drive and difficulty maintaining muscle, though individual response varies and other factors can contribute. This result warrants attention.',
    educationContext: TESTOSTERONE_EVIDENCE,
    recommendation:
      'Your testosterone is below the level where lifestyle changes and supplements alone are likely to make a meaningful difference. The most clinically effective intervention at this level is Testosterone Replacement Therapy, which requires clinical assessment and a prescription. We are building that service. Men who register now secure their place at the front of the queue when it launches.',
  },

  'normal-testosterone': {
    stateLabel: 'Your results indicate testosterone in the normal range',
    explanation:
      'Your total testosterone is within the normal range, sitting in the lower half. This is common for men in their late thirties and forties; it is not deficient, but it is not in the upper zone either. Many men in this range feel functional but not fully themselves, particularly as levels continue their natural gradual decline.',
    educationContext: TESTOSTERONE_EVIDENCE,
    recommendation:
      'Your testosterone is in range but towards the lower end. Zinc contributes to the maintenance of normal testosterone levels. Most UK men fall short of the optimal daily intake from diet alone. The Daily Stack provides 30mg of elemental zinc alongside Active B12 and Vitamin D3.',
  },

  'optimal-testosterone': {
    stateLabel: 'Your results indicate optimal testosterone levels',
    explanation:
      'Your total testosterone is in the upper zone of the normal range. This is a strong result. The symptoms most commonly associated with low testosterone are unlikely to be explained by your hormone level at this reading.',
    educationContext: TESTOSTERONE_EVIDENCE,
    recommendation:
      'Your testosterone is in a strong zone. No intervention is indicated for this marker. Testing again in 3–6 months will confirm it is staying there. A second reading gives you a trend, not just a snapshot.',
  },

  'shbg-low': {
    stateLabel: 'Your results indicate low SHBG',
    explanation:
      'Your SHBG is below the normal range. Low SHBG means a greater proportion of your testosterone is circulating unbound, which sounds positive but can be associated with metabolic changes including insulin resistance. In isolation, a low SHBG reading is worth noting alongside your full testosterone picture rather than acting on alone.',
    educationContext: SHBG_EVIDENCE,
    recommendation:
      'Low SHBG in isolation does not require a specific action. The combined picture of your total testosterone and free testosterone is what matters. If your free testosterone is within the reference range, this result does not need immediate follow-up. If you notice it trending lower on future tests, or if you have specific symptoms, it is worth discussing with a GP.',
  },

  'shbg-normal': {
    stateLabel: 'Your SHBG is within the normal range',
    explanation:
      'Your SHBG is within the normal range. It is binding and releasing testosterone at a typical rate. This means your free testosterone should be in proportion to your total testosterone. Check your Free T result for confirmation.',
    educationContext: SHBG_EVIDENCE,
    recommendation:
      'Your SHBG is not limiting your testosterone access. No action is needed for this marker. It is a useful baseline to track over time alongside your total and free testosterone.',
  },

  'shbg-high': {
    stateLabel: 'Your results indicate elevated SHBG',
    explanation:
      'Your SHBG is above the normal range. SHBG is a protein that binds to testosterone and makes it biologically unavailable; your body cannot use what is locked up. A high SHBG means a greater proportion of your total testosterone is bound and inactive. Even if your total testosterone appears acceptable, elevated SHBG can mean your body is not accessing as much of it as it should. Your Free T result reflects this directly.',
    educationContext: SHBG_EVIDENCE,
    recommendation:
      'Elevated SHBG is reducing the proportion of testosterone your body can actively use. If your free testosterone is below range as a result, this is the most likely cause. There are no supplements with an established basis for lowering SHBG directly. If your free testosterone is also below range and your total testosterone is low, this combination is worth discussing with a doctor.',
  },

  'ft-low': {
    stateLabel: 'Your results indicate low free testosterone',
    explanation:
      'Your free testosterone is below the reference range. This is the fraction your body can actually use. It is what enters your cells and drives the effects most people associate with testosterone: energy, drive, mood, and muscle function. A low free testosterone reading, regardless of where your total testosterone sits, indicates your body is accessing less active testosterone than it should be.',
    educationContext: FREE_T_EVIDENCE,
    // Default recommendation — classifier replaces this when T-LOW is also present
    recommendation:
      'Your free testosterone is below range despite your total testosterone being within normal limits. The most common reason for this pattern is elevated SHBG, which binds a higher-than-expected proportion of your available testosterone. There are no direct supplement interventions for this. It is worth discussing with a doctor if you are experiencing symptoms that align with low testosterone.',
  },

  'ft-normal': {
    stateLabel: 'Your free testosterone is within the reference range',
    explanation:
      'Your free testosterone is within the reference range. This is the testosterone your body can actually use, and yours is in the expected zone. Taken together with your total testosterone and SHBG, this is the most meaningful read on your hormonal status.',
    educationContext: FREE_T_EVIDENCE,
    recommendation:
      'Your free testosterone is within the reference range. No action is needed for this marker. A second test in 3–6 months will confirm the picture is consistent over time.',
  },

  'critically-low-vitamin-d': {
    stateLabel: 'Your results indicate critically low Vitamin D',
    explanation:
      'Your Vitamin D is significantly below adequate levels; this is not a borderline result, but one at the low end of the deficient range. At this level, the direct impact on muscle function and energy is well established. In the UK, this level is most common after winter months and in men who spend the majority of their time indoors. It responds well to supplementation.',
    educationContext: VITAMIN_D_EVIDENCE,
    recommendation:
      'Your Vitamin D is significantly below adequate levels. Supplementation with Vitamin D3 is the standard approach. At this level, a higher initial dose is often used to restore levels more quickly, so we would recommend discussing the appropriate dose with your GP given the depth of the deficiency. The Daily Stack contains Vitamin D3, which contributes to normal muscle function, and is appropriate for ongoing maintenance once levels are restored.',
  },

  'low-vitamin-d': {
    stateLabel: 'Your results indicate low Vitamin D',
    explanation:
      'Your Vitamin D is below the level most research considers adequate for energy and muscle function. This is one of the most common results we see in UK men, particularly between October and March. Without direct sunlight exposure, which is limited for most of the year in the UK, maintaining adequate levels requires supplementation for most men.',
    educationContext: VITAMIN_D_EVIDENCE,
    recommendation:
      'Your Vitamin D is below adequate levels. Daily supplementation with Vitamin D3 is the most direct way to address this. The Daily Stack contains Vitamin D3, which contributes to normal muscle function, alongside Zinc and Active B12.',
  },

  'normal-vitamin-d': {
    stateLabel: 'Your Vitamin D is within the adequate range',
    explanation:
      'Your Vitamin D is within the adequate range. Your body has enough to support normal muscle function and immune response at current levels. Given seasonal variation in the UK, it is worth retesting in autumn or winter — levels typically fall between October and March even when summer levels are good.',
    educationContext: VITAMIN_D_EVIDENCE,
    recommendation:
      'No supplementation is immediately required for this marker based on this result. Retesting in autumn or winter will tell you whether seasonal change is affecting your level.',
  },

  'elevated-crp': {
    stateLabel: 'Your results indicate mildly elevated inflammation',
    explanation:
      'Your hs-CRP is mildly elevated. This marker measures low-level systemic inflammation. A result in this range can have several causes: training recovery, sleep quality, diet or connective tissue stress. It is not a critical result, but it indicates your body is managing more background inflammation than the optimal baseline.',
    educationContext: CRP_EVIDENCE,
    // Not shown — qualifier card replaces recommendation section for elevated CRP states
    recommendation:
      'The question below will help us show you the most relevant next step for your specific result.',
  },

  'moderate-crp': {
    stateLabel: 'Your results indicate moderately elevated inflammation',
    explanation:
      'Your hs-CRP is moderately elevated. This level of systemic inflammation is worth paying attention to. A result in this range can be driven by several factors: active infection, training load, sleep deficit, diet or joint and connective tissue stress. The question below will help us show you the most relevant next step for your specific result.',
    educationContext: CRP_EVIDENCE,
    // Not shown — qualifier card replaces recommendation section for elevated CRP states
    recommendation:
      'The question below will help us show you the most relevant next step for your specific result.',
  },

  'high-crp': {
    stateLabel: 'Your results indicate significantly elevated inflammation',
    explanation:
      'Your hs-CRP is significantly elevated. At this level, the result warrants a conversation with your GP before taking any other steps. This is not a normal post-training or dietary response; it indicates a level of systemic inflammation that needs to be investigated.',
    educationContext: CRP_EVIDENCE,
    recommendation:
      'We recommend speaking to your GP before considering any supplementation. At this level, a GP assessment is the right first step.',
  },

  'normal-crp': {
    stateLabel: 'Your hs-CRP is within the normal range',
    explanation:
      'Your hs-CRP is within the normal range. There is no significant systemic inflammation indicated by this result. For active men, this is a positive finding and a useful baseline to track over time.',
    educationContext: CRP_EVIDENCE,
    recommendation:
      'No action is needed for this marker. Tracking it on future tests is worthwhile — it is a sensitive early signal of changes in training recovery, sleep quality, and diet.',
  },

  'low-ferritin': {
    stateLabel: 'Your results indicate critically low iron stores',
    explanation:
      'Your ferritin is below the level we consider adequate for active men. Ferritin is the protein that stores iron in your body; a low reading means your iron reserves are significantly depleted. At this level, persistent fatigue, reduced exercise performance, and slow recovery are common findings. This result needs follow-up with your GP before you take any iron supplement.',
    educationContext: FERRITIN_EVIDENCE,
    recommendation:
      'We do not sell iron supplements, and we would not recommend taking one without medical guidance. Iron is one of the few supplements where taking the wrong dose carries genuine clinical risk. Your GP can confirm whether iron supplementation is appropriate, at what dose, and for how long, and will likely want to investigate the cause. Take your ferritin number and the reference range to your appointment.',
  },

  'suboptimal-ferritin': {
    stateLabel: 'Your iron stores are in the lower end of the normal range',
    explanation:
      'Your ferritin is within the laboratory reference range but towards the lower end. Many active men experience the effects of suboptimal iron stores in this zone, particularly persistent fatigue and slower recovery, even though the result does not sit in the critically low category. This is one of the most commonly overlooked causes of unexplained fatigue in otherwise healthy men who train regularly.',
    educationContext: FERRITIN_EVIDENCE,
    recommendation:
      'Your ferritin is within range but in the lower zone where active men often notice the effects. Increasing dietary iron is the first step: red meat, liver, lentils, spinach and fortified cereals are the best sources. Pairing iron-rich food with Vitamin C increases absorption. If fatigue persists and your level does not improve on a retest, a GP conversation is the appropriate next step. We do not sell iron supplements; the dosing risk means it needs to be managed by a doctor.',
  },

  'normal-ferritin': {
    stateLabel: 'Your iron stores are within the normal range',
    explanation:
      'Your ferritin is well within the reference range. Your iron stores appear adequate. Persistent fatigue or slow recovery is unlikely to be driven by iron depletion at this level.',
    educationContext: FERRITIN_EVIDENCE,
    recommendation:
      'Your ferritin is in a strong range. Iron depletion is not contributing to any fatigue or recovery issues you may have. If you are still experiencing unexplained fatigue, your other results may point to the relevant cause.',
  },

  'low-b12': {
    stateLabel: 'Your results indicate low active B12',
    explanation:
      'Your active B12 is below 37.5 pmol/L. Active B12 is the form your body can actually use — it is what enters your cells and supports energy metabolism, cognitive function, and the formation of healthy red blood cells. A result below this threshold indicates your cells have less B12 available than they need to function optimally.',
    educationContext: B12_EVIDENCE,
    recommendation:
      'Your active B12 is below the optimal threshold. B12 is almost entirely sourced from animal products — meat, fish, eggs, and dairy. If your diet is varied and includes these foods regularly, absorption rather than intake may be the issue; this is worth discussing with your GP. The Daily Stack contains B12 as Methylcobalamin, a highly bioavailable form that contributes to normal energy-yielding metabolism and normal psychological function.',
  },

  'normal-b12': {
    stateLabel: 'Your active B12 is within the normal range',
    explanation:
      'Your active B12 is within the normal range. This is the form of B12 your cells can actually use, and yours is at a level that supports normal energy metabolism and cognitive function.',
    educationContext: B12_EVIDENCE,
    recommendation:
      'No supplementation is required based on this result. If your diet is predominantly plant-based, retesting in 6–12 months is worthwhile — B12 stores can gradually deplete without regular animal-source food intake.',
  },

  'low-albumin': {
    stateLabel: 'Your results indicate low albumin',
    explanation:
      'Your albumin is below 35 g/L. Albumin is a protein produced by the liver and is one of the inputs used to calculate your free testosterone. A result below this level is worth discussing with your GP — it can reflect changes in liver function, kidney function, or nutritional status that are separate from your hormone profile and need to be properly assessed.',
    educationContext:
      'Albumin is the most abundant protein in the bloodstream. It is produced by the liver and transports hormones, enzymes, and other molecules through the blood. In hormone testing, albumin binds to testosterone with lower affinity than SHBG, meaning that fraction remains more readily available to tissues. Both albumin and SHBG are used in the Vermeulen formula to calculate free testosterone. Low albumin can be associated with liver or kidney conditions, malnutrition, or systemic inflammation — a separate clinical consideration from the hormone results.',
    recommendation:
      'Albumin below the normal range is outside the scope of what a home blood test alone can investigate. We recommend raising this result with your GP. Your free testosterone calculation may be less reliable at this level, and the underlying cause of low albumin should be established before any other action is taken.',
  },

  'normal-albumin': {
    stateLabel: 'Your albumin is within the normal range',
    explanation:
      'Your albumin is within the normal range. It is used as a calculation input for your free testosterone result — a normal albumin confirms the free T figure is based on a reliable baseline. No action is needed for this marker.',
    educationContext:
      'Albumin is a protein produced by the liver that binds to testosterone with lower affinity than SHBG, making that fraction more readily available to tissues. Both albumin and SHBG are used in the Vermeulen formula to calculate free testosterone from a total testosterone reading. A normal albumin result confirms the accuracy of that calculation.',
    recommendation:
      'Your albumin is within the normal range. No action is needed for this marker.',
  },

  normal: {
    stateLabel: 'This marker is within the normal range',
    explanation: 'This marker falls within the standard reference range.',
    educationContext:
      'Regular retesting helps you track changes over time. A normal result today is a useful baseline for the future.',
    recommendation:
      'No action is needed for this marker. Retesting in 3 to 6 months will help you track how your levels change over time.',
  },
}
