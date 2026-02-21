import type { ReactNode } from "react";
import { Fragment } from "react";



import { ItemList } from "@/components/core/ItemList";
import type { IItem } from "@/lib/model/Items";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";
import { DEFAULT_ITEM } from "@/lib/helper/defaults";

const modelData: IItem[] = [
  {
    "id": "4ff74586-f008-4599-934a-6ec210755873",
    "userId": "4b4b6b2d-f453-496c-bbb2-4371362f386d",
    "category": "devastation",
    "summary": "Dedico dedico voluntarius bellum adficio creptio articulus.",
    "description": "Aspernatur timor certus. Curriculum quidem apto ver suffragium tres cultura coma ad. Demens constans perspiciatis coniecto defluo.\nTenetur suppellex volva sollers credo. Sonitus solio tertius doloribus stipes ultio cernuus conventus. Tersus sapiente texo tenetur victoria.\nAttero aggredior avaritia terror capio voluptate cura. Textor celo cultura umerus sollicito utique decerno terga. Crudelis deleniti subvenio.",
    "note": "Adversus bibo tabgo.",
    "tag": [
      "secrecy",
      "role",
      "pigpen",
      "parade",
      "sprinkles"
    ],
  },
  {
    "id": "d14553fb-265e-4ed9-9faa-8bf2d26d6622",
    "userId": "5076cbfa-9fa5-4a8c-8a87-7e534011457a",
    "category": "trolley",
    "summary": "Administratio cultura mollitia audio consectetur cedo volutabrum.",
    "description": "Consectetur solio tabernus unde quasi. Ocer vallum depono tubineus verus audio officia thymbra adnuo. Adduco bellum vergo creptio tum convoco carpo.\nAdduco argumentum verto cultellus. Subiungo aurum fugiat pecco civitas volva utilis sodalitas. Adinventitias omnis synagoga in utpote velit suus conventus.\nSynagoga est inventore. Centum vinum vestigium cui carmen altus accendo. Illum pecco officiis vinculum venio adulatio.",
    "note": "Coadunatio pectus urbs cariosus aranea currus odio eius animi.",
    "tag": [
      "mozzarella",
      "fort",
      "cake",
      "juggernaut",
      "birdbath"
    ],
  },
  {
    "id": "2986764d-2535-46dd-94d7-105940b956ed",
    "userId": "cfa72596-65be-4b83-a3df-7d2cc5b384e5",
    "category": "finding",
    "summary": "Tergeo desino ocer corona demonstro coadunatio.",
    "description": "Excepturi ars admiratio praesentium valetudo cetera acquiro abbas civitas aiunt. Veritas tergum dapifer crastinus veritas agnitio super coma. Deputo voluptatum cattus tam coerceo atque.\nAngustus tantum vulpes voluptate clibanus vulticulus cupio atrox defluo vesco. Dignissimos nisi amaritudo canis catena. Nesciunt laudantium suggero vergo recusandae.\nAt sopor suppono versus caecus. Adduco contigo crebro. Tubineus acerbitas confido coma aliquam arbustum.",
    "note": "Crastinus ullus trado atque consequuntur color auxilium caecus capillus vorax.",
    "tag": [
      "archaeology",
      "flood",
      "galoshes",
      "label",
      "shoulder"
    ],
  },
  {
    "id": "2da5ca63-d20b-4680-8745-654756fbb4fd",
    "userId": "4b4b6b2d-f453-496c-bbb2-4371362f386d",
    "category": "finding",
    "summary": "Commodo decor desidero aestivus verbum totidem laboriosam.",
    "description": "Avaritia velut thema caste vos voluptatibus tolero. Turpis aggredior iusto quaerat cubo cupressus sint. Repellat villa admitto infit talio creator.\nEsse spero venio anser sophismata. Umerus suppellex curiositas non aperte. Corrigo angulus xiphias abutor.\nClamo audacia aptus pectus tamdiu volaticus vapulus conatus. Appello acies harum. Venio tristis correptius dolores.",
    "note": "Pecus vulariter id solvo.",
    "tag": [
      "fort",
      "omelet",
      "freight",
      "dependency",
      "scorn"
    ],
  },
  {
    "id": "c06d9e4c-6898-40cc-825a-f475f076f8e8",
    "userId": "410d80b8-77bb-4b87-af67-e9aa444e2962",
    "category": "sightseeing",
    "summary": "Viriliter cotidie laboriosam pecus suffragium tabgo sum crinis iste coadunatio.",
    "description": "Labore terror curso corrupti. Varius aedificium aequitas sed. Adfero ulterius stipes arbitro pecto ancilla tepidus territo.\nCelo acidus vitae vulgaris. Cur adicio patria tempus atrox temperantia adficio. Vulnus tamquam curso aperio conspergo maxime adduco cerno tabernus.\nNatus dapifer curto toties. Antiquus taceo ratione conculco conturbo adstringo vos ars curatio. Cavus tolero virga vulgo vorax tempore capto certe aliquam triumphus.",
    "note": "Absum turpis consectetur reiciendis comminor.",
    "tag": [
      "heating",
      "prohibition",
      "suitcase",
      "fraudster",
      "independence"
    ],
  },
  {
    "id": "69bf2f50-e079-4ec1-ae20-2cabcecc2928",
    "userId": "5076cbfa-9fa5-4a8c-8a87-7e534011457a",
    "category": "pressure",
    "summary": "Impedit autus cognomen.",
    "description": "Villa ustulo labore speciosus nihil tres defetiscor ceno caelestis. Spiritus adnuo voveo terra cetera debitis colligo vel colo. Audio contigo utilis.\nTunc surgo clementia communis coepi tamquam cupio. Canonicus depromo teres adinventitias tendo sumptus concido. Vomica eius fuga aestas varius.\nImpedit depereo infit calamitas tametsi aegrotatio concedo alienus. Inventore clementia attollo vaco terga amplexus suppellex. Vinitor triumphus vorax ascisco vetus cras centum.",
    "note": "Sollers uter verbum decimus tamdiu barba addo.",
    "tag": [
      "heartache",
      "scholarship",
      "lifestyle",
      "transom",
      "stump"
    ],
  },
  {
    "id": "5ac58d46-bf83-4a47-a2c9-921e240fd504",
    "userId": "e44999e3-4d28-443d-bb20-eb7d2520a004",
    "category": "midwife",
    "summary": "Clam cena sum cui thema temeritas.",
    "description": "Demo attero villa incidunt careo aperte amo degero coma deporto. Tertius acidus tabella harum averto abstergo vinitor curso deleniti unus. Crebro vulnero aequitas adaugeo quaerat similique quia ars theatrum spiculum.\nSed pel adficio causa temporibus. Conqueror triumphus ara vereor tumultus acquiro capto conqueror caveo. Conor velut dens deprecator.\nIusto correptius solitudo tyrannus. Inflammatio rem adversus deduco taedium. Denego depono unus terra desparatus copia.",
    "note": "Necessitatibus vulgus argumentum turpis tamisium provident excepturi vomica decipio.",
    "tag": [
      "tomatillo",
      "catalyst",
      "commercial",
      "fraudster",
      "trench"
    ],
  },
  {
    "id": "ae028d37-dcc5-450b-a1b1-fedfa5f6005c",
    "userId": "94f2cfbe-01b0-4263-a2eb-9ca13e85453e",
    "category": "straw",
    "summary": "Ea dicta nesciunt sint amitto creator absorbeo vox vulgo.",
    "description": "Commemoro carcer despecto aegrus carus careo. Trado sophismata corpus curia catena cohibeo ratione depulso vestigium alius. Utor admoveo traho uredo.\nSuasoria natus curvo corrupti ea. Civitas suasoria confido desparatus angelus repellat cervus voluptatibus. Tabella adflicto quis collum comedo subito avaritia atrocitas.\nAnnus ea solitudo consuasor stabilis mollitia conatus textilis. Voluptatibus et centum abundans toties comitatus. Demum ter mollitia fugit.",
    "note": "Aequitas pecto ocer supellex non agnitio.",
    "tag": [
      "bog",
      "tributary",
      "deer",
      "jury",
      "bourgeoisie"
    ],
  },
  {
    "id": "ba84f773-ba1a-4b7b-bb89-1c092c8b1525",
    "userId": "94f2cfbe-01b0-4263-a2eb-9ca13e85453e",
    "category": "thread",
    "summary": "Celo cetera reprehenderit defaeco.",
    "description": "Demum velociter debilito utrum suasoria spoliatio animi cuppedia claustrum laudantium. Verecundia illo valens verbera bene eius. Repellat cenaculum quam angustus tripudio ut.\nAspernatur alius utpote. Confugo dolorem argentum. Cedo confido audentia sol aeternus tolero capto.\nDecens careo absque. Iste admiratio defungo consectetur adsidue calamitas tamdiu. Cursus ustilo comis damnatio.",
    "note": "Caute vester deludo thesaurus voluntarius cohors denuncio blandior cimentarius.",
    "tag": [
      "pigpen",
      "galoshes",
      "fort",
      "scorn",
      "makeover"
    ],
  },
];

export function ItemListLayout(): ReactNode {

  // ToDo: Define mutation
  const mutateItem = (anitem: IItem) => console.log(anitem);
  const store: TBoundStore = useBoundStore((state) => state);



  return (
    <Fragment>
      {store.modal && <AppItemModal mutateItem={mutateItem} />}
      <ItemList title="Category - CHANGE ME " data={modelData} />
    </Fragment>
  );
}
