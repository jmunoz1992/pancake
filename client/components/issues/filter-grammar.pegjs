/*
PEG.js grammar for Pancake issue filter
Input example:
  labels:bug,wontfix,"issue management" assignees:vbarrancos status:open some body text
Output:
  {
    "labels": [
        "bug",
        "wontfix",
        "issue management"
    ],
    "assignees": [
        "vbarrancos"
    ],
    "status": "open",
    "text": [
        "some",
        "body",
        "text"
    ]
  }

Can be used to generate a PEG.js parser at:
https://pegjs.org/online
*/

Expression
  = _ conditions:(LabelAssigneeCondition / StatusCondition / UnmatchedTextCondition)* _
    {
      const expression = {};
      conditions.forEach(condition => {
        let c = expression[condition.category]
        if (c)
          c = c.concat(condition.value)
        else
          c = condition.value;
        expression[condition.category] = c;
      })
      return expression;
    }

LabelAssigneeCondition
  = _ category:("labels" / "assignees") ":" [ ]? value:ValueList _
    { return { category, value } }

StatusCondition
  = _ category:"status" ":" value:("open" / "closed") _
    { return { category, value } }

UnmatchedTextCondition
  = _ text:[^ \t\n\r]+ _
    { return { category: "text", value: [text.join("")] } }

ValueList "value list"
  = values:(Value [,]?)+
    { return values.map(v => v[0]) }

Value "value"
  = text:Token+
    { return text.join(""); }
  / "\"" quotedText:[^\"]* "\""
    { return quotedText.join(""); }

Token
  = [^ ,\"\t\n\r]

_ "whitespace"
  = [ \t\n\r]*
