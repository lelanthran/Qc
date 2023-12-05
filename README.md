# Qc
Qc: A quick component helper library for DOM elements.

## Some ideas for easy usage:
HTML with subscribe/post mechanism:
```html
<psjs-tree>
    <psjs-bind for=id-input1 />
    <psjs-bind for=id-input2 />
    <psjs-bind for=id-input3 />
    <psjs-bind for=id-input4 />
    <psjs-publish onevent='click' channel="CHAN1" subject="SUBJ1">
        <button>Submit</button>
    </psjs-publish>
    <psjs-subscribe channel="CHAN2" subject="SUBJ2" />
</psjs-tree>

...

<psjs-tree>
    <psjs-publisher>
        <psjs-publish for=id-input-pb />
        <psjs-publish-event onevent='change' channel="PBUPDATED" subject="UI-UPDATE">
    </psjs-publisher>
    <psjs-subscriber channel="PBUPDATED" subject="SERVER-UPDATE">
        <psjs-subscribe for=id-input-pb>
    </psjs-subscriber>
    <input type=progress min=1 max=100 id=id-input-pb />
</psjs-tree>

<!--
    For when we want to subscribe and execute callbacks
-->
<psjs-tree>
    <psjs-subscribe-event channel="rpc-response" subject="*"
        execute='myFuncCall(channel, subject, msgObject);' />
</psjs-tree>

```


